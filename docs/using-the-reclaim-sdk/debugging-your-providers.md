# Debugging your Providers

## Opening debugger

When on the **Sign in to verify screen**, you can tap on the URL to open the debugger

![](<../.gitbook/assets/image (1).png>)

## Common Troubleshooting

### Incorrect URL opened

Make sure the correct url has been opened. Look for the URL in the debugger. This should be an exact match to the URL you had used when creating the HttpsProvider.

### Login Cookies don't match

A login is considered successful only when _all_ the loginCookies defined in the HttpsProvider have been set to a non null value. You can see what cookies you had defined in the Https Provider under "Checking for cookies" section on the debugger. Below that you'll see a section called "Found" - this denotes the cookies that you defined, that were actually found to be set.

### Regex not found

The regular expression will be matched exactly on the source code.

\{{VAR\_NAME\}} syntax can be used to capture values into variables.&#x20;

\{{VAR\_NAME\}} is equivalent to `(.*?)` regex and stored in VAR\_NAME.

More debugging tools for regex matching coming soon.
