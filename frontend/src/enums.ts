
const enum HOME_SECTION
{
  PROFILE,
  CHAT_USER,
  CHAT_GROUP,
	GAME_REQUEST,
  GROUP_REQUEST
}

enum logStatus {
  DEFAULT,
  IS2FA,
  ISNOT2FA
}

enum enChatType {
  OneOnOne = "individual",
  Group ="group"
}

enum enChatMemberRank {
  OWNER = "owner",
  ADMIN = "admin",
  MEMBER = "member",
}

enum enChatMemberState {
  PRIVILEDGED = "priviledged",
  BANNED = "banned",
}
export { HOME_SECTION, logStatus, enChatType, enChatMemberRank, enChatMemberState};
