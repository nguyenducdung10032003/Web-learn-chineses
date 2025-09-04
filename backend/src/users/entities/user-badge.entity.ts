import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from "typeorm";
import { Badge } from "./badges.entity";
import { User } from "./user.entity";

@Entity("user_badges")
export class UserBadge {
  @PrimaryColumn({ name: "user_id" })
  userId: number;

  @PrimaryColumn({ name: "badge_id" })
  badgeId: number;

  @ManyToOne(() => User, (user) => user.badges, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Badge, (badge) => badge.userBadges, { onDelete: "CASCADE" })
  @JoinColumn({ name: "badge_id" })
  badge: Badge;

  @Column({ name: "earned_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  earnedAt: Date;

  @Column({ type: "tinyint", default: 1 })
  earned: boolean;
}
