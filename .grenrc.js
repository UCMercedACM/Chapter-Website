module.exports = {
    dataSource: "prs",
    prefix: "Release ",
    ignoreLabels: [
        "actions",
        "angular",
        "dependencies",
        "documentation",
        "duplicate",
        "help wanted",
        "invalid",
        "question",
        "test",
        "wontfix",
        "workflows",
    ],
    template: {
        commit: ({ message, url, author, name }) =>
            `- [${message}](${url}) - ${author ? `@${author}` : name}`,
        issue: "- {{labels}} {{name}} [{{text}}]({{url}})",
        label: "[**{{label}}**]",
        noLabel: "closed",
        group: "\n#### {{heading}}\n",
        changelogTitle: "# Changelog\n\n",
        release: function (placeholders, body) {
            var fDate = new Date(placeholders.date);
            return `## ${placeholders.release} ${fDate}\n${placeholders.body}`;
        },
        releaseSeparator: "\n---\n\n",
    },
    onlyMilestones: false,
    groupBy: {
        "Features:": ["enhancement"],
        "Bug Fixes:": ["bug"],
    },
    changelogFilename: "CHANGELOG.md",
};
