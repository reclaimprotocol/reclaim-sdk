# Handling Errors

While using the HTTPS provider in the Reclaim Protocol, developers may encounter various errors. It is important to handle these errors gracefully to provide a smooth user experience. Here are a few common errors and recommended strategies for handling them:

* **Wrong Login Cookies**: If the provided login cookies are incorrect, the proof generation process may fail to detect a successful login, resulting in an unsuccessful proof generation. To mitigate this issue, developers can verify the correctness of the login cookies by sending a cURL request with the exact cookies mentioned in the headers and confirming that the expected response is received.
* **Wrong Regex**: If the provided regex does not exist on the HTML page, especially in the case of dynamically loaded pages (e.g., React or Next.js applications), the regex may fail to match. In such scenarios, it is essential to identify the API calls made by the React app and use the API URL instead of the website URL. Developers can identify the appropriate API request by opening the debugging console in Chrome, navigating to the Network tab, and identifying the API request that receives the desired response. The Reclaim Wallet App's debugging pane can also provide information about the attempted regex match.
* **Website Doesn't Support TLS 1.3**: Reclaim Protocol is compatible only with websites that support TLS 1.3. Websites using TLS 1.2 or earlier versions are not compatible. Developers can check the TLS version used by a website by opening the Chrome debugging console, navigating to the Security tab, and reviewing the displayed TLS version.

By understanding these common errors and implementing appropriate error handling strategies, developers can ensure a robust and reliable integration with the HTTPS provider in the Reclaim Protocol.

\
