@echo off
REM ============================================================
REM  Painel Solugy - execucao do extrator (chamado pela Tarefa Agendada)
REM  Ajuste PYTHON e SCRIPT abaixo se os caminhos forem diferentes.
REM ============================================================
setlocal

REM Caminho do Python (use "py" se instalou o launcher, ou o caminho completo)
set PYTHON=py

REM Pasta onde esta este .bat e o extrator
set BASE=%~dp0

REM Log de execucao (fica ao lado do extrator)
set LOG=%BASE%extrator.log

echo. >> "%LOG%"
echo ==== %date% %time% ==== >> "%LOG%"
"%PYTHON%" "%BASE%extrator_solugy.py" >> "%LOG%" 2>&1

endlocal
