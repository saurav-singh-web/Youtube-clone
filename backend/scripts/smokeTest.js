const API_BASE_URL = "http://127.0.0.1:5000/api";

const uniqueId = Date.now();
const testUser = {
  username: `testuser${uniqueId}`,
  email: `testuser${uniqueId}@example.com`,
  password: "password123",
};

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(`${options.method || "GET"} ${path} failed: ${response.status} ${JSON.stringify(data)}`);
  }

  return data;
};

const runSmokeTest = async () => {
  const registerResult = await request("/auth/register", {
    method: "POST",
    body: JSON.stringify(testUser),
  });
  console.log("Register:", registerResult.message);

  const loginResult = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: testUser.email,
      password: testUser.password,
    }),
  });
  console.log("Login:", loginResult.message);

  const authHeaders = {
    Authorization: `Bearer ${loginResult.token}`,
  };

  const profileResult = await request("/auth/profile", {
    headers: authHeaders,
  });
  console.log("Profile:", profileResult.user.username);

  const channelResult = await request("/channels", {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      channelName: `Code Channel ${uniqueId}`,
      description: "Backend smoke test channel",
      channelBanner: "https://picsum.photos/1200/300",
    }),
  });
  console.log("Create channel:", channelResult.channel.channelName);

  const channelId = channelResult.channel._id;

  const videoResult = await request("/videos", {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      title: `Learn React Smoke Test ${uniqueId}`,
      thumbnailUrl: "https://picsum.photos/640/360",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      description: "Smoke test video description",
      category: "Coding",
      channelId,
    }),
  });
  console.log("Create video:", videoResult.video.title);

  const videoId = videoResult.video._id;

  const allVideos = await request("/videos");
  console.log("Fetch videos:", allVideos.videos.length);

  const searchedVideos = await request(`/videos?search=${encodeURIComponent("React Smoke Test")}`);
  console.log("Search videos:", searchedVideos.videos.length);

  const filteredVideos = await request("/videos?category=Coding");
  console.log("Filter videos:", filteredVideos.videos.length);

  const singleVideo = await request(`/videos/${videoId}`);
  console.log("Fetch video:", singleVideo.video.title);

  const likeResult = await request(`/videos/${videoId}/like`, {
    method: "POST",
    headers: authHeaders,
  });
  console.log("Like video:", likeResult.likes);

  const dislikeResult = await request(`/videos/${videoId}/dislike`, {
    method: "POST",
    headers: authHeaders,
  });
  console.log("Dislike video:", dislikeResult.dislikes);

  const commentResult = await request(`/comments/video/${videoId}`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      text: "This is a smoke test comment.",
    }),
  });
  console.log("Add comment:", commentResult.comment.text);

  const commentId = commentResult.comment._id;

  const comments = await request(`/comments/video/${videoId}`);
  console.log("Fetch comments:", comments.comments.length);

  const updatedComment = await request(`/comments/${commentId}`, {
    method: "PUT",
    headers: authHeaders,
    body: JSON.stringify({
      text: "Updated smoke test comment.",
    }),
  });
  console.log("Update comment:", updatedComment.comment.text);

  await request(`/comments/${commentId}`, {
    method: "DELETE",
    headers: authHeaders,
  });
  console.log("Delete comment: success");

  const updatedVideo = await request(`/videos/${videoId}`, {
    method: "PUT",
    headers: authHeaders,
    body: JSON.stringify({
      title: `Updated React Smoke Test ${uniqueId}`,
    }),
  });
  console.log("Update video:", updatedVideo.video.title);

  await request(`/videos/${videoId}`, {
    method: "DELETE",
    headers: authHeaders,
  });
  console.log("Delete video: success");

  const updatedChannel = await request(`/channels/${channelId}`, {
    method: "PUT",
    headers: authHeaders,
    body: JSON.stringify({
      description: "Updated backend smoke test channel",
    }),
  });
  console.log("Update channel:", updatedChannel.channel.description);

  await request(`/channels/${channelId}`, {
    method: "DELETE",
    headers: authHeaders,
  });
  console.log("Delete channel: success");

  console.log("Backend smoke test completed successfully.");
};

runSmokeTest().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
