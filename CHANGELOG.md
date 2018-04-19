## Changelog

Todos los cambios importantes son escritos aquí. El Formato esta basado en [Keep a Changelog](http://keepachangelog.com/es-ES/1.0.0/)

### [Unreleased]

### [1.1.0] - 2018-04-19
#### Changed
- Se modifica la opción de cache local, para que sea activada cuando se considere necesario

### [1.0.1] - 2018-01-07
#### Added
- Se utiliza [debug][debug], para visualizar la información relevante en el flujo de cache local y de redis
- Se agrega eslintignore

#### Changed
- Se modifica eslintrc para utilizar https://github.com/zerointermittency/eslint-config-zi

### [1.0.0] - 2018-01-07
#### Added
- Se agregan pruebas funcionales con el objetivo de tener probado todo el código, usando [istanbul js][istanbul] para saber cuanto
- Se agrego el metodo para buscar los hash por patrón (hfind)
- Se agrego el bulk para la operación hmset de redis (hmsetBulk)
- Se agrego el bulk para la operación hgetall de redis (hgetallBulk)
- Se implemento la funcionalidad para borrar **keys** de la DB con patrones (deletePattern)
- Se agrego una forma para añadir los scripts de **[lua][lua]** a las nuevas instancias de redis
- Se implemente en **nset** el tiempo de expiración
- Se agrega funcionalidad para setear (nset) y eliminar (ndel) información
- Se genera estrategia para el momento de obtener información, llamar al cache local, sobre el cache de redis
- README.md instalación, pruebas, uso y como contribuir al proyecto

[defineCommand]: https://bitbucket.org/smartbox_way/nunchee-js/src/master/defineCommand
[defineCommandIndex]: https://bitbucket.org/smartbox_way/nunchee-js/src/master/defineCommand/index.js
[ioredis]: https://github.com/luin/ioredis
[newRedis]: https://github.com/luin/ioredis/blob/master/API.md#new_Redis
[redis]: https://redis.io
[redis-hgetall]: https://redis.io/commands/hgetall
[redis-hmset]: https://redis.io/commands/hmset
[redis-keys]: https://redis.io/commands/keys
[redis-del]: https://redis.io/commands/del
[lua]: https://redis.io/commands/eval
[istanbul]: https://istanbul.js.org/
[debug]: https://www.npmjs.com/package/debug