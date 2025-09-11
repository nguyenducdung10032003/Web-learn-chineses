import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deck } from './entities/deck.entity';
import { CreateDeckDto } from './dto/create-deck.dto';
import { UpdateDeckDto } from './dto/update-deck.dto';
import { UserDeck } from './entities/user-deck.entity';
import { StudyStats } from './entities/studyStats.entity';
import { StudyActivity } from './entities/studyActivity.entity';
import { RecordStudyDto } from './dto/record-study.dto';
import { UserActivity } from 'src/users/entities/user-activity.entity';
import { User } from 'src/users/entities/user.entity';
import { Flashcard } from './entities/flashcard.entity';

@Injectable()
export class DecksService {
  constructor(
    @InjectRepository(Deck)
    private readonly deckRepository: Repository<Deck>,
    @InjectRepository(UserDeck) private userDeckRepo: Repository<UserDeck>,
    @InjectRepository(StudyStats) private statsRepo: Repository<StudyStats>,
    @InjectRepository(StudyActivity)
    private activityRepo: Repository<StudyActivity>,
    @InjectRepository(UserActivity)
    private userActivityRepo: Repository<UserActivity>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Flashcard)
    private readonly flashcardRepo: Repository<Flashcard>,
  ) {}

  async createDeck(userId?: number, dto?: CreateDeckDto) {
    try {
      // 1. Tạo deck
      const deck = this.deckRepository.create({
        userId,
        title: dto?.title,
        description: dto?.description,
        category: dto?.category,
        totalCards: dto?.flashcards?.length || 0,
        isPersonal: true,
        image: '/uploads/vocabulary.png',
        level: 'Tùy chỉnh',
        color: 'bg-purple-500',
      });

      const savedDeck = await this.deckRepository.save(deck);

      // 2. Tạo flashcards (bỏ id nếu có)
      if (dto?.flashcards?.length) {
        const flashcards = dto.flashcards.map((card) =>
          this.flashcardRepo.create({
            chinese: card.chinese,
            pinyin: card.pinyin,
            vietnamese: card.vietnamese,
            deckId: savedDeck.id,
          }),
        );

        await this.flashcardRepo.save(flashcards);
        savedDeck.flashcards = flashcards;
      } else {
        savedDeck.flashcards = [];
      }

      return savedDeck;
    } catch (err) {
      console.error('❌ Lỗi createDeck:', err);
      throw err;
    }
  }

  async findAll(userId?: number) {
    const qb = this.deckRepository
      .createQueryBuilder('deck')
      .leftJoinAndSelect('deck.flashcards', 'flashcard')
      .leftJoinAndSelect('deck.studyActivities', 'studyActivity')
      .leftJoinAndSelect('deck.user', 'user');

    if (userId) {
      qb.leftJoinAndSelect(
        'deck.userDecks',
        'userDeck',
        'userDeck.userId = :userId',
        { userId },
      );
      qb.where(
        '(deck.isPersonal = false OR (deck.isPersonal = true AND user.id = :userId))',
        { userId },
      );
    } else {
      qb.addSelect([]);
      qb.where('deck.isPersonal = false');
    }

    return qb.getMany();
  }
  async recordStudy(userId: number, dto: RecordStudyDto) {
    const { deckId, correct, flashcardIds, timeSpent } = dto;
    const cardsCount = dto.flashcardIds ? dto.flashcardIds.length : 1;
    const correctCards = correct ? cardsCount : 0;

    // Helper function để so sánh ngày (bỏ qua giờ phút)
    const isSameDay = (date1: Date, date2: Date): boolean => {
      return date1.toDateString() === date2.toDateString();
    };

    const isConsecutiveDay = (prevDate: Date, currentDate: Date): boolean => {
      const prev = new Date(prevDate);
      const current = new Date(currentDate);
      prev.setHours(0, 0, 0, 0);
      current.setHours(0, 0, 0, 0);

      const diffTime = current.getTime() - prev.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      return diffDays === 1;
    };

    const today = new Date();

    /** 1. Update user_decks */
    let userDeck = await this.userDeckRepo.findOne({
      where: { userId, deckId },
    });

    if (!userDeck) {
      userDeck = this.userDeckRepo.create({
        userId,
        deckId,
        studiedCards: 0,
        masteredCards: 0,
        streak: 0,
        lastStudied: today,
      });
    } else {
      // Cập nhật streak cho deck
      if (!isSameDay(userDeck.lastStudied!, today)) {
        if (isConsecutiveDay(userDeck.lastStudied!, today)) {
          userDeck.streak += 1;
        } else {
          userDeck.streak = 1; // Reset streak nếu không học liên tục
        }
      }
    }

    userDeck.studiedCards += cardsCount;
    if (correct) userDeck.masteredCards += correctCards;
    userDeck.lastStudied = today;

    await this.userDeckRepo.save(userDeck);

    /** 2. Update study_stats */
    let stats = await this.statsRepo.findOne({ where: { userId } });

    if (!stats) {
      stats = this.statsRepo.create({
        userId,
        totalCards: 0,
        studiedToday: 0,
        streak: 0,
        accuracy: 0,
        timeSpent: 0,
        lastStudied: today,
      });
    } else {
      // Cập nhật streak cho stats
      if (stats.lastStudied && !isSameDay(stats.lastStudied, today)) {
        if (isConsecutiveDay(stats.lastStudied, today)) {
          stats.streak += 1;
        } else {
          stats.streak = 1;
        }
      } else if (!stats.lastStudied) {
        stats.streak = 1;
      }
    }

    stats.totalCards += cardsCount;
    stats.studiedToday += cardsCount;
    stats.timeSpent += timeSpent;

    // Tính accuracy
    const prevCorrect =
      (stats.accuracy / 100) * (stats.totalCards - cardsCount);
    stats.accuracy = ((prevCorrect + correctCards) / stats.totalCards) * 100;
    stats.lastStudied = today;

    await this.statsRepo.save(stats);

    /** 3. Upsert study_activity */
    let activity = await this.activityRepo.findOne({
      where: { userId, deckId },
    });

    const xpEarned = correctCards * 10 + (cardsCount - correctCards) * 5;

    if (!activity) {
      activity = this.activityRepo.create({
        userId,
        deckId,
        cards: cardsCount,
        accuracy: (correctCards / cardsCount) * 100,
        xp: xpEarned,
        activityTime: today,
      });
    } else {
      activity.cards += cardsCount;
      activity.accuracy =
        (((activity.accuracy / 100) * (activity.cards - cardsCount) +
          correctCards) /
          activity.cards) *
        100;
      activity.xp += xpEarned;
      activity.activityTime = today;
    }

    await this.activityRepo.save(activity);

    /** 4. Create user activity */
    const userActivity = this.userActivityRepo.create({
      userId,
      type: 'flashcard',
      title: `Học ${cardsCount} thẻ trong bộ Deck ${deckId}`,
      xp: xpEarned,
      activityTime: today,
    });

    await this.userActivityRepo.save(userActivity);

    /** 5. Update user XP và streak */
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (user) {
      user.xp += xpEarned;

      // Cập nhật streak cho user
      if (user.lastActive) {
        const lastActive = new Date(user.lastActive);
        if (!isSameDay(lastActive, today)) {
          if (isConsecutiveDay(lastActive, today)) {
            user.streak += 1;
          } else {
            user.streak = 1; // Reset streak
          }
        }
      } else {
        user.streak = 1; // Lần đầu học
      }

      user.lastActive = today;

      // Kiểm tra level-up
      if (user.xp >= user.xpToNextLevel) {
        user.level += 1;
        user.xp = user.xp - user.xpToNextLevel;
        user.xpToNextLevel = Math.floor(user.xpToNextLevel * 1.5);
      }

      await this.userRepository.save(user);
    }

    return { message: 'Study recorded', userDeck, stats };
  }
  // async recordStudy(userId: number, dto: RecordStudyDto) {
  //   const { deckId, flashcardResults = [], timeSpent = 0 } = dto;

  //   // Tính tổng số cards và số cards đúng
  //   const cardsCount = flashcardResults.length;
  //   const correctCards = flashcardResults.filter(f => f.correct).length;

  //   /** 1. Update user_decks */
  //   let userDeck = await this.userDeckRepo.findOne({ where: { userId, deckId } });
  //   if (!userDeck) {
  //     userDeck = this.userDeckRepo.create({
  //       userId,
  //       deckId,
  //       studiedCards: 0,
  //       masteredCards: 0,
  //       streak: 0,
  //       lastStudied: new Date(),
  //     });
  //   }

  //   userDeck.studiedCards += cardsCount;
  //   userDeck.masteredCards += correctCards;
  //   userDeck.lastStudied = new Date();
  //   await this.userDeckRepo.save(userDeck);

  //   /** 2. Update study_stats */
  //   let stats = await this.statsRepo.findOne({ where: { userId } });
  //   if (!stats) {
  //     stats = this.statsRepo.create({
  //       userId,
  //       totalCards: 0,
  //       studiedToday: 0,
  //       streak: 0,
  //       accuracy: 0,
  //       timeSpent: 0,
  //     });
  //   }

  //   const prevTotalCards = stats.totalCards;
  //   stats.totalCards += cardsCount;
  //   stats.studiedToday += cardsCount;
  //   stats.timeSpent += timeSpent;

  //   // Tính accuracy tích lũy, tránh chia cho 0
  //   const prevCorrect = (stats.accuracy / 100) * prevTotalCards;
  //   stats.accuracy = stats.totalCards > 0
  //     ? ((prevCorrect + correctCards) / stats.totalCards) * 100
  //     : 0;

  //   await this.statsRepo.save(stats);

  //   /** 3. Insert ONE study_activity per session */
  //   const activity = this.activityRepo.create({
  //     userId,
  //     deckId,
  //     cards: cardsCount,
  //     accuracy: cardsCount > 0 ? (correctCards / cardsCount) * 100 : 0,
  //     xp: cardsCount > 0 ? correctCards * 10 + (cardsCount - correctCards) * 5 : 0,
  //     activityTime: new Date(),
  //   });
  //   await this.activityRepo.save(activity);
  //   if (cardsCount > 0) {
  //   const activity = this.activityRepo.create({
  //     userId,
  //     deckId,
  //     cards: cardsCount,
  //     accuracy: (correctCards / cardsCount) * 100,
  //     xp: correctCards * 10 + (cardsCount - correctCards) * 5,
  //     activityTime: new Date(),
  //   });
  //   await this.activityRepo.save(activity);
  // }
  //   return { message: 'Study recorded', userDeck, stats, activity };
  // }

  findOne(id: number) {
    return this.deckRepository.findOne({
      where: { id },
      relations: ['flashcards', 'studyActivities'],
    });
  }

  update(id: number, updateDeckDto: UpdateDeckDto) {
    return this.deckRepository.update(id, updateDeckDto);
  }

  remove(id: number) {
    return this.deckRepository.delete(id);
  }
}
