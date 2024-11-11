# Docker

Per garantire il corretto funzionamento delle richieste Ajax utili per il caricamento del file XML, è stato predisposto l'uso di un server apache ver. 2.4 tramite un container docker. L'immagine usata è la httpd:2.4.
Una volta avviato il container il server Apache girerà in background e non sarà necessaria nessuna modifica.

## Istruzioni per la visualizzazione della pagina
Per visualizzare correttamente la pagina, è necessario avere installato Docker. Seguire i passaggi seguenti:

1. Assicurarsi di avere Docker installato sul proprio sistema.
2. Mappare correttamente il percorso alla macchina host della cartella contenente i file.
3. Avviare il container utilizzando il comando:
    ```bash
    docker-compose up
    ```
4. Visitare la pagina [localhost:82](http://localhost:82) per visualizzare il contenuto caricato dagli XML.

Assicurarsi che Docker sia in esecuzione correttamente per garantire il corretto funzionamento del caricamento dagli XML.
In caso di conflitti è possibile cambiare la porta di mapping con la macchina host direttamente dal file docker-compose.yml.

## Volume

Il volume alla presente cartella viene montato direttamente sul container per cui ad ogni nuova modifica dei file sulla macchina host corrisponde una immediata modifica sul container.