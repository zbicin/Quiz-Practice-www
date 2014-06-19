window.onerror = function (message, file, line) {
    window.external.Notify("Error in Application: " +
        message + ". Source File: " + file + ", Line: " + line);
}