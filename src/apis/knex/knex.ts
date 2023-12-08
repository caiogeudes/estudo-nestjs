import Knex from 'knex';
const knex = Knex({
    client: 'pg',
    connection: {
        host: "localhost",
        port: 5432,
        user: "postgres",
        password: "postgres",
        database: "nestapi"
    }
})

export default knex;