
export default [
	({ story }, res) => res.sendResponse({ story: story.toObject({}) }),
];
