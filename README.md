# Logreader

Web interface to read text logs.  Based on [create-react-app](https://github.com/facebookincubator/create-react-app) and
[react-virtualized](https://github.com/bvaughn/react-virtualized).

## Features

* Ability to display huge files.
* Highlighting important lines (errors, test).
* Generating shareable URL with line number.

# NOTES:
- .htaccess will make sure that the app will not be cached at the price of page being slow to reload.

# Q/A

## How to add test/issues to log reader rules? 

In short, look into this commit. [This commit](https://github.com/cms-sw/cms-bot/commit/46d22af761a179f3a92c78d8c3d62be31054456e)

In long asnwer, look where (this)[https://github.com/cms-sw/cms-bot/blob/21c82a6c9102ca0fadae7490da693119346d4b09/logreaderUtils.py#L19] 
function is used. Don't forget it can take custom rules or that it has unit test.
