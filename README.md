# Stanbol entityhub repository

With this repository you can create links using a [http://incubator.apache.org/stanbol/](stanbol) instance.

## How to Install
### Load scripts
    <script type="text/javascript" src="../plugins/Aloha-Plugin-StanbolRepository/stanbol.js"></script>
    <script type="text/javascript" src="../plugins/Aloha-Plugin-StanbolRepository/iks.stanbolconnector.js"></script>
### Configuration
Define the stanbol server url, default: http://localhost:8080/
    GENTICS.Aloha.Repositories.stanbolRepository.settings.stanbolUrl = 'http://stanbol.iksfordrupal.net:9000';

