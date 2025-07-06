from pathlib import Path
import fitz  # PyMuPDF
from langchain.schema import Document

def load_documents(data_path: str) -> list[Document]:
    docs = []

    for file_path in Path(data_path).rglob("*"):
        try:
            if file_path.suffix == ".txt":
                with open(file_path, "r", encoding="utf-8") as f:
                    text = f.read().strip()
                    if text:
                        docs.append(Document(page_content=text, metadata={"source": file_path.name, "type": "txt"}))

            elif file_path.suffix == ".pdf":
                with fitz.open(file_path) as doc:
                    pdf_text = ""
                    for page in doc:
                        pdf_text += page.get_text()
                    pdf_text = pdf_text.strip()
                    if pdf_text:
                        docs.append(Document(page_content=pdf_text, metadata={"source": file_path.name, "type": "pdf"}))

        except Exception as e:
            print(f"Skipped {file_path.name}: {e}")

    print(f"Loaded {len(docs)} valid documents")
    return docs
