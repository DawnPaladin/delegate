# Delegate

This simple Slack bot allows you to divide tasks among your team members. The intended use case is that you're discussing your project in a Slack channel and coming up with action items. 

When you've identified a task that needs to be done, write **/delegate @user Task to be completed**; Delegate will DM your teammate with the task and give them a "Complete" button to click. When they click the button, Delegate will report back in the original channel that the task is complete.

Built with [BotKit](https://botkit.ai/docs/v4/reference/slack.html). The file with all the business logic in it is [features/delegate.js](features/delegate.js).
