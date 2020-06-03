module.exports = {
  dataSource: "commits",
  prefix: "Release ",
  template: {
    commit: ({ message, url, author, name }) =>
      `- [${message}](${url}) - ${author ? `@${author}` : name}`,
    release: function (placeholders, body) {
      var fDate = new Date(placeholders.date);
      return `## ${placeholders.release} ${fDate}\n${placeholders.body}`;
    },
    releaseSeparator: "\n---\n\n",
  },
  onlyMilestones: false,
};
