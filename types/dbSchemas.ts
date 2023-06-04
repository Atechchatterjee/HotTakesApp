export type DiscussionTopicSchema = {
  topic: string;
  type: "normal" | "debate";
  author: string;
  community: string;
  active: boolean;
};

export type DiscussionSchema = {
  discussionTopics: DiscussionTopicSchema;
  description: string;
  user: string;
};

export type UserSchema = {
  userId: string;
  avatarImgSrc: string;
  name: string;
  isAuthor: boolean;
};
