import moment from "moment";
import Cookies from "js-cookie";

export function getChatSentTime(date: Date | string | undefined) {
  if (!date) {
    return "no date for chat";
  }

  // Parse the sentAt timestamp
  const messageTime = moment(date);

  // Format the message time as desired
  return messageTime.format("MMMM Do YYYY, h:mm A");
}

export function getUserToken() {
  const token = Cookies.get("token");
  return token;
}

export function getUserRefreshToken() {
  const refreshToken = Cookies.get("refreshToken");
  return refreshToken;
}
