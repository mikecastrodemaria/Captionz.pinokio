module.exports = {
  daemon: true,
  run: [
    {
      method: "shell.run",
      params: {
        venv: "env",
        env: {
          PYTHONUTF8: "1",
          PYTHONIOENCODING: "utf-8"
        },
        path: "app",
        message: [
          // Gradio UI (same as the Hugging Face Space, Ollama backend locally).
          // Gradio picks the next free port itself; --no-browser because Pinokio opens the UI.
          "python gradio_app.py --no-browser"
        ],
        on: [{
          // Capture the local URL (e.g. "Running on local URL:  http://127.0.0.1:7860")
          "event": "/(http:\\/\\/[0-9.:]+)/",
          "done": true
        }]
      }
    },
    {
      method: "local.set",
      params: {
        url: "{{input.event[1]}}"
      }
    }
  ]
}
