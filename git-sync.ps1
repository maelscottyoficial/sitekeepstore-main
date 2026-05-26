param(
    [string]$Message = "Auto-sync"
)

# Verifica se é um repositório Git
if (-not (Test-Path ".git")) {
    Write-Error "Esta pasta não é um repositório Git."
    exit 1
}

# Verifica se há alterações
$changes = git status --porcelain
if ([string]::IsNullOrWhiteSpace($changes)) {
    Write-Host "Nenhuma alteração para enviar."
    exit 0
}

Write-Host "Alterações detectadas, enviando para o GitHub..."

git add -A

git commit -m $Message

# Atualiza antes de enviar (evita conflito simples)
git pull --rebase

git push