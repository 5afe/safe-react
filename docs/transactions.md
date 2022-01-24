# Transactions

### Statuses

The status of a transaction can vary depending on whether it has just been submitted, confirmed or was (successfully) executed. An overview of transaction statuses is as follows:

| Status                                                                       | Description                                                              |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Needs your confirmation /<br>Needs confirmations<br>`AWAITING_CONFIRMATIONS` | The transaction still requires confirmations.                            |
| Needs execution<br>`AWAITING_EXECUTION` /<br>`PENDING_FAILED`\*                                      | The transaction has sufficient confirmations but has yet to be executed.<br><br>The requested execution was rejected by the user but it can be attempted again.* |
| Cancelled<br>`CANCELLED`                                                     | The transaction was cancelled.                                           |
| Failed<br>`FAILED`                                                           | The transaction failed.                                                  |
| Pending<br>`PENDING`\*                                                       | The transaction has been submitted and is waiting to be mined.*           |
| Success<br>`SUCCESS`                                                         | The transaction was successfully executed.                               |
| Transaction will be replaced<br>`WILL_BE_REPLACED`                           | A corresponding rejection transaction has been created.                  |

\*frontend-only statuses used for UI changes.
