[![Build Status](https://travis-ci.org/zerointermittency/redis.svg?branch=master)](https://travis-ci.org/zerointermittency/redis)
[![Maintainability](https://api.codeclimate.com/v1/badges/c3afc1fac7199fbbc9d5/maintainability)](https://codeclimate.com/github/zerointermittency/redis/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/c3afc1fac7199fbbc9d5/test_coverage)](https://codeclimate.com/github/zerointermittency/redis/test_coverage)
[![npm version](https://badge.fury.io/js/%40zerointermittency%2Fredis.svg)](https://badge.fury.io/js/%40zerointermittency%2Fredis)
[![Downloads](https://img.shields.io/npm/dt/@zerointermittency/redis.svg)](https://www.npmjs.com/package/@zerointermittency/redis)
[![dependency status](https://david-dm.org/zerointermittency/redis.svg)](https://david-dm.org/zerointermittency/redis)
[![devDependency status](https://david-dm.org/zerointermittency/redis/dev-status.svg)](https://david-dm.org/zerointermittency/redis)

# Bienvenido

Este modulo pretende tener la estrategia para manejar el cache en **[redis][redis]** de todos los módulos y proyectos.

## Instalación

```bash
yarn add @zerointermittency/redis
# npm i --save @zerointermittency/redis
```

## Errores estandarizados

Código | Nombre | Mensaje
-------|--------|----------------------------
100    |type    |"{varName}" must be "{type}"
101    |empty   |Empty var {varName}

## Api

El modulo extiende de la clase del modulo **[ioredis][ioredis]**, para poder hacer algunas validaciones, conservar todos los métodos que nos provee **[ioredis][ioredis]** y mejorar la estrategia de redis que el ya posee.

##### Iniciar

Se debe instanciar un objeto como se hace a continuación:

```javascript
let redis = new ZIRedis({port: 6379, host: '127.0.0.1'});
```

**Argumentos**:

- options (Object):
    - host \(*String*\) **required**: identifica donde esta el server de redis, default: localhost
    - port \(*Number*\) **required**: puerto al cual se conecta redis, default: 6379
    - local \(*Boolean*\): activa el cache local, para mantener en memoria una copia del valor guardado, default: false

> Para mayor informacion sobre todos los campos aceptados, leer **[new redis][newRedis]**.

**Retorna**:

\(*ZIRedis*\): Retorna la instancia de la clase **ZIRedis**.

##### Método **nget**

Este método tiene su nombre por ser de nunchee y llamar al get de **[ioredis][ioredis]**. Se crea con el fin de mejorar la estrategia de get de ioredis, agregando sobre este método un redis local.

```javascript
let redis = new ZIRedis({port: 6379, host: '127.0.0.1'});
redis.set('foo', 'bar');
redis.nget('foo', ttlLocal)
    .then((bar) => /* bar => 'bar' */)
    .catch((err) => /* error interno de redis o ioredis */);
```

**Argumentos**:

- key \(*String*\) **required**: identifica el elemento que queremos obtener de redis
- ttlLocal \(*Number*\): tiempo para mantener el resultado en el cache local, por defecto **30 segundos**

**Retorna**:

- \(*String*\): Retorna el valor que este guardado en redis según la key pasada por parámetro


**Prueba de rendimiento**

```bash
$ yarn benchmark benchmark/nget-get.js

cache.get x 4,413 ops/sec ±34.20% (49 runs sampled)
cache.nget x 2,106,822 ops/sec ±8.20% (74 runs sampled)
cache.ttl x 7,762 ops/sec ±2.18% (74 runs sampled)
cache.exists x 7,782 ops/sec ±2.61% (69 runs sampled)
Fastest is cache.nget
```

Determinando que la implementación de **nget** supera notablemente **get** de **[ioredis][ioredis]**. Tambien se compara el rendimiento de **ttl** y **exists**


##### Método **nset**

Este método al igual que nget tiene su nombre por ser de nunchee y llamar al set de **[ioredis][ioredis]**. Se crea con el fin ayudar en la creación de las referencias a la información y poder poder utilizar la estrategia de redis local antes del redis de redis.

```javascript
let redis = new ZIRedis({port: 6379, host: '127.0.0.1'});
redis.nset('foo', 'bar');
redis.nset(key, value, seconds, secondsLocal);
```

**Argumentos**:

- key \(*String*\) **required**: identifica el elemento que queremos obtener de redis
- value \(*String*\) **required**: valor que se desea guardar, según la key pasada
- seconds \(*Number*\): segundos que se desea mantener en redis del valor, por defecto **60 segundos**
- secondsLocal \(*Number*\): segundos que se desea mantener local el valor, por defecto **30 segundos**


##### Método **ndel**

Este se crea al igual que nget y nset con el fin de mejorar la estrategia de get de ioredis.

```javascript
let redis = new ZIRedis({port: 6379, host: '127.0.0.1'});
redis.ndel('foo');
redis.ndel(key);
```

**Argumentos**:

- key \(*String*\) **required**: identifica el elemento que queremos eliminar de redis y del redis local.

##### Método **deletePattern**

Se combinan los métodos **[keys][redis-keys]** y **[del][redis-del]** de redis por simplicidad y comodidad.

```javascript
let redis = new ZIRedis({port: 6379, host: '127.0.0.1'});
redis.deletePattern('foo*')
    .then((totalDeleted) => {})
    .catch((err) => /* error interno de redis o ioredis */);
```

**Argumentos**:

pattern \(*String*\) **required**: patrón a seguir de los elementos a borrar.

**Retorna**:

\(*Number*\): Retorna la cantidad de elementos eliminados

##### Método **hmsetBulk**

Este metodo proviene del **[hmset][redis-hmset]** de redis solo que permite realizar el bulk del mismo.

```javascript
let redis = new ZIRedis({port: 6379, host: '127.0.0.1'});
redis.hmsetBulk({
    key1: {
        key1: 'value1',
        key2: 'value2',
        key3: 'value3',
        key4: 'value4',
    },
    key2: {
        key1: 'value1',
        key2: 'value2',
    },
    key3: {
        key1: 'value1',
        key2: 'value2',
        key3: 'value3',
        key4: 'value4',
        key5: 'value5',
    },
})
    .then((results) => {})
```

**Argumentos**:

elements \(*Object*\) **required**: objecto de objetos

**Retorna**:

\(*Array*\): Retorna el resultado de cada operación el cual puede ser error o el string `'ok'`

```javascript
// example
results = [
    [new ExampleError()],
    [null, 'OK'],
]
```

##### Método **hgetallBulk**

Este metodo proviene del **[hgetall][redis-hgetall]** de redis solo que permite realizar el bulk del mismo.

```javascript
let redis = new ZIRedis({port: 6379, host: '127.0.0.1'});
redis.hgetallBulk(['key1', 'key2', 'key3', 'key4'])
    .then((result) => {})
```

**Argumentos**:

keys \(*Array*\) **required**: listados de llaves a buscar

**Retorna**:

\(*Array*\): Listado de resultados por llave buscada la cual contiene 2 valores por llave buscada: el error si es que existe y el objecto con los valores guardados.

```javascript
// example
result = [
    [
        null, { // found
            key1: 'value1',
            key2: 'value2',
            key3: 'value3',
            key4: 'value4',
        },
    ],
    [
        null, { // found
            key1: 'value1',
            key2: 'value2',
        },
    ],
    [
        null, { // found
            key1: 'value1',
            key2: 'value2',
            key3: 'value3',
            key4: 'value4',
            key5: 'value5',
        },
    ],
    [
        null, { // not found
        },
    ],
]
```

##### Método **hfind**

Se combinan los métodos **[keys][redis-keys]** y `hgetallBulk` por simplicidad y comodidad.

```javascript
let redis = new ZIRedis({port: 6379, host: '127.0.0.1'});
redis.hfind('foo*')
    .then((results) => {})
    .catch((err) => /* error interno de redis o ioredis */);
```

**Argumentos**:

pattern \(*String*\) **required**: patrón a seguir de los elementos a traer.

**Retorna**:

\(*Object*\): Retorna el objecto con las keys encontradas o `null` en caso de no encontrar nada.

```javascript
// example
results = {
    key1: {
        key1: 'value1',
        key2: 'value2',
        key3: 'value3',
        key4: 'value4',
    },
    key2: {
        key1: 'value1',
        key2: 'value2',
    },
    key3: {
        key1: 'value1',
        key2: 'value2',
        key3: 'value3',
        key4: 'value4',
        key5: 'value5',
    },
}
```

## Scripts en **[lua][lua]**

Para agregar un nuevo script este debe ser creado como un archivo en la carpeta **[defineCommand][defineCommand]** con el nombre de la funcionalidad y con el siguiente formato de ejemplo:

```javascript
// ruta: defineCommand/deletePattern.js
'use strict';

module.exports = {
    name: 'deletePattern',
    definition: {
        numberOfKeys: 1,
        lua: 'return redis.call(\'del\', unpack(redis.call(\'keys\', KEYS[1])))',
    },
};
```

Ademas se tiene que agregar en el archivo **[index.js][defineCommandIndex]** el **require** al archivo del nuevo método:

```javascript
'use strict';

const newCommands = [
    require('./deletePattern.js'),
];

...
```

Para utilizar la nueva funcionalidad basta con instanciar la clase solamente.

```javascript
'use strict';

    redis = new ZIRedis();

redis.deletePattern('test*');
...
```

## Pruebas funcionales (Unit Testing)

Se llevaron a cabo las siguientes pruebas:

```bash
$ yarn test
```

### Pruebas de rendimiento (Benchmark)

Con el objetivo de mejorar la estrategia de redis del get de [ioredis][ioredis], se implemento nget y se compara su funcionalidad al ejecutar el siguiente comando:

```bash
$ yarn benchmark benchmark/nget-get.js

cache.get x 4,413 ops/sec ±34.20% (49 runs sampled)
cache.nget x 2,106,822 ops/sec ±8.20% (74 runs sampled)
cache.ttl x 7,762 ops/sec ±2.18% (74 runs sampled)
cache.exists x 7,782 ops/sec ±2.61% (69 runs sampled)
Fastest is cache.nget
```

Determinando que la implementación de **nget** supera notablemente **get** de **[ioredis][ioredis]**. Tambien se compara el rendimiento de **ttl** y **exists**

Otra prueba que se realizo en el contexto de implementación, es comparar una funcion **async/await** vs **promise**

```bash
$ yarn benchmark benchmark/nget-ngetAsync.js

cache.nget x 2,137,106 ops/sec ±7.18% (67 runs sampled)
ngetAsync x 1,807,064 ops/sec ±1.83% (78 runs sampled)
Fastest is cache.nget
```

Determinando que la implementación con **promise** es mas eficiente

Al comenzar a generar nuevos metodos con **bulk** de objectos se busco la forma más rapida de recorrerlos por lo cual se hizo el siguiente benchmark:

```bash
$ yarn benchmark benchmarck/object-elements.js

object.entries x 947,030 ops/sec ±1.52% (86 runs sampled)
object.keys x 4,141,516 ops/sec ±2.41% (82 runs sampled)
object for in x 4,715,356 ops/sec ±1.31% (83 runs sampled)
Fastest is object for in
```

Lo cual nos dejo como resultado que la forma mas rapida de recorrer un objecto es por medio de la sentencia **for...in**.

## Changelog

Todos los cambios importantes son escritos [aquí](CHANGELOG.md).

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