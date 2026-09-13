module.exports = {
  daemon: true,
  run: [
    {
      method: "shell.run",
      params: {
        venv: "env",
        // Force UTF-8 stdout/stderr on Windows consoles (cp1252) so accented
        // log lines never raise UnicodeEncodeError.
        env: {
          PYTHONUTF8: "1",
          PYTHONIOENCODING: "utf-8"
        },
        path: "app",
        message: [
          // NiceGUI web UI. NiceGUI binds a fixed port (8080) by default, so the
          // next free port is passed in; --no-browser because Pinokio opens the UI.
          "python app.py --ui web --port {{port}} --no-browser"
        ],
        on: [{
          // Capture the local URL (e.g. "NiceGUI ready to go on http://127.0.0.1:8080")
          "event": "/(http:\\/\\/[0-9.:]+)/",
          "done": true
        }]
      }
    },
    {
      // Expose the captured URL to pinokio.js (Open Web UI menu item)
      method: "local.set",
      params: {
        url: "{{input.event[1]}}"
      }
    }
  ]
}
