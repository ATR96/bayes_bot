# bayes_bot

**bayes_bot** is an open-source chatbot designed to answer anything from basic finance to advanced quantitative finance queries, with a splash of Bayesian wisdom. Whether you're puzzled about portfolio theory, options pricing, or just want to understand a CDO (without judgment), Bayes_Bot has you covered.

---

## Features

-  **RAG pipeline** with FAISS for semantic search
-  **HuggingFace Transformers** for answer generation
-  **FastAPI** backend for a blazing fast API
-  Semantic similarity search via `all-MiniLM-L6-v2` embeddings
-  Includes unit tests for loader and vectorstore
-  Swagger/OpenAPI documentation at `/docs`

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/bayes_bot.git
cd bayes_bot

```

### 2. Create a virtual environment

```bash
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate

```

### 3. Install dependencies

```bash
pip3 install -r requirements.txt

```

### 4. Load your documents and create the FAISS index

```bash
python backend/retriever/test_vectorstore.py

```
### 5. Start the FastAPI server

```bash
uvicorn backend.api.main:app --reload

```
Visit http://localhost:8000/docs to use the Swagger UI.

## License

- This project is licensed under the MIT License. See the LICENSE file for details.

