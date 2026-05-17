FROM python:3.11-slim AS builder

WORKDIR /build

COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt


# ---- Stage 2: runtime ----
FROM python:3.11-slim AS runtime

# Usuário não-root para segurança
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

WORKDIR /app

# Copia apenas as dependências instaladas do builder
COPY --from=builder /root/.local /root/.local

# Copia código da aplicação
COPY ./app ./app

# Garante que os binários do pip --user estão no PATH
ENV PATH=/root/.local/bin:$PATH

USER appuser

EXPOSE 8000

# Gunicorn com workers para produção (ou uvicorn para dev)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]