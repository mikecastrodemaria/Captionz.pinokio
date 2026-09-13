# Captionz.pinokio

1-click [Pinokio](https://pinokio.computer) launcher for
**[Captionz](https://github.com/mikecastrodemaria/Captionz)** — batch image captioning
with local Ollama vision models.

## What it does

Installs and launches Captionz in one click:

- **Install** — clones `mikecastrodemaria/Captionz` into `app/`, creates a venv and
  installs the requirements (Pillow, NiceGUI, Gradio). No PyTorch: the models run in
  Ollama.
- **Start (web UI)** — runs the NiceGUI interface (`python app.py --ui web`) and opens it.
- **Start (Gradio UI)** — runs the Gradio interface (`python gradio_app.py`), the same one
  used on Hugging Face Spaces, here with the Ollama backend.
- **Update** — resets the launcher and the app to their `origin/main`, refreshes deps.
- **Reset** — removes `app/` (and its venv) to reinstall from scratch.

## Features (Captionz)

Vision-model detection · composed prompts (caption type × length × 20 checkable
options × character name) or custom prompt with a live preview · sources: local
path, upload, clipboard paste · image preview · editable captions · skip / overwrite /
append policy · prefix / suffix (trigger word) · live status (model loading, timer,
percent, ETA) · max-tokens cap and thinking switch · dark mode · CLI and benchmark
script. See the app repo for full docs.

## Requirements

- [Pinokio](https://pinokio.computer) installed.
- [Ollama](https://ollama.com) running on the machine (or reachable on the network:
  change the URL in the UI) with at least one vision model, for example:

```bash
ollama pull qwen3-vl:8b
```

Captions are written next to each image as `image.txt`.

## How to use

1. Install, then **Start (web UI)** and click **Open Web UI**.
2. Pick the vision model, add a folder path (or upload / paste images).
3. Choose a caption type, length and options; check the final prompt preview.
4. Click **Captionner tout**. Edit any caption in the right panel and save.

## API

Captionz has no HTTP API of its own. Two programmatic entry points exist in `app/`:

### Command line (Python, inside the launcher venv)

```bash
python cli.py ./dataset --recursive --type "Booru tag list" --length short
python cli.py ./dataset --model qwen3-vl:8b --option 3 --option 15 --prefix "mystyle, "
python cli.py --list-models
python cli.py --list-options
```

### Python (import the core)

```python
import sys; sys.path.insert(0, "app")
from pathlib import Path
from captionz_core import Settings, Job, make_backend, caption_job

s = Settings.load()
s.model = "qwen3-vl:8b"
s.caption_type, s.caption_length = "Training caption (paragraph)", "long"
job = caption_job(Job(Path("photo.jpg")), s, make_backend(s))
print(job.status, job.caption)
```

### Gradio UI API (when "Start (Gradio UI)" is running)

Gradio exposes every event as an endpoint; open `<url>/?view=api` for the generated
docs, or from Python:

```python
from gradio_client import Client, handle_file
c = Client("http://127.0.0.1:7860")
print(c.view_api())
```

### JavaScript (Gradio client)

```javascript
import { Client } from "@gradio/client";
const c = await Client.connect("http://127.0.0.1:7860");
console.log(await c.view_api());
```

### Curl (Ollama directly, same request Captionz sends)

```bash
curl http://localhost:11434/api/chat -d '{
  "model": "qwen3-vl:8b", "stream": false,
  "messages": [{"role": "user", "content": "Describe this image in one short sentence.",
                "images": ["<base64 image>"]}]
}'
```
