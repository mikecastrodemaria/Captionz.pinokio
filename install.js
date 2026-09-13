module.exports = {
  run: [
    // Clone Captionz into the local app/ folder
    {
      method: "shell.run",
      params: {
        message: [
          "git clone https://github.com/mikecastrodemaria/Captionz app"
        ]
      }
    },
    // Install Captionz dependencies (Pillow, NiceGUI, Gradio) in a dedicated venv.
    // No torch: the local backend is Ollama (separate install, see README).
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "app",
        message: [
          "uv pip install -r requirements.txt"
        ]
      }
    },
    // Deduplicate the venv to save disk space
    {
      method: "fs.link",
      params: {
        venv: "app/env"
      }
    }
  ]
}
