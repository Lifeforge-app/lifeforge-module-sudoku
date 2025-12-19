import z from 'zod'

const sudokuSchemas = {
  sessions: {
    schema: z.object({
      current_board_index: z.number(),
      created: z.string(),
      updated: z.string()
    }),
    raw: {
      id: 'pbc_1095810794',
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
      name: 'sudoku__sessions',
      type: 'base',
      fields: [
        {
          autogeneratePattern: '[a-z0-9]{15}',
          hidden: false,
          id: 'text3208210256',
          max: 15,
          min: 15,
          name: 'id',
          pattern: '^[a-z0-9]+$',
          presentable: false,
          primaryKey: true,
          required: true,
          system: true,
          type: 'text'
        },
        {
          hidden: false,
          id: 'number535196252',
          max: null,
          min: null,
          name: 'current_board_index',
          onlyInt: false,
          presentable: false,
          required: false,
          system: false,
          type: 'number'
        },
        {
          hidden: false,
          id: 'autodate2990389176',
          name: 'created',
          onCreate: true,
          onUpdate: false,
          presentable: false,
          system: false,
          type: 'autodate'
        },
        {
          hidden: false,
          id: 'autodate3332085495',
          name: 'updated',
          onCreate: true,
          onUpdate: true,
          presentable: false,
          system: false,
          type: 'autodate'
        }
      ],
      indexes: [],
      system: false
    }
  },
  entries: {
    schema: z.object({
      difficulty: z.string(),
      duration_elapsed: z.number(),
      board: z.any(),
      user_answers: z.any(),
      user_candidates: z.any(),
      session: z.string(),
      index: z.number(),
      is_completed: z.boolean(),
      created: z.string(),
      updated: z.string()
    }),
    raw: {
      id: 'pbc_2786237679',
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
      name: 'sudoku__entries',
      type: 'base',
      fields: [
        {
          autogeneratePattern: '[a-z0-9]{15}',
          hidden: false,
          id: 'text3208210256',
          max: 15,
          min: 15,
          name: 'id',
          pattern: '^[a-z0-9]+$',
          presentable: false,
          primaryKey: true,
          required: true,
          system: true,
          type: 'text'
        },
        {
          autogeneratePattern: '',
          hidden: false,
          id: 'text3144380399',
          max: 0,
          min: 0,
          name: 'difficulty',
          pattern: '',
          presentable: false,
          primaryKey: false,
          required: false,
          system: false,
          type: 'text'
        },
        {
          hidden: false,
          id: 'number3051213438',
          max: null,
          min: null,
          name: 'duration_elapsed',
          onlyInt: false,
          presentable: false,
          required: false,
          system: false,
          type: 'number'
        },
        {
          hidden: false,
          id: 'json1482042183',
          maxSize: 0,
          name: 'board',
          presentable: false,
          required: false,
          system: false,
          type: 'json'
        },
        {
          hidden: false,
          id: 'json1355859462',
          maxSize: 0,
          name: 'user_answers',
          presentable: false,
          required: false,
          system: false,
          type: 'json'
        },
        {
          hidden: false,
          id: 'json3440393952',
          maxSize: 0,
          name: 'user_candidates',
          presentable: false,
          required: false,
          system: false,
          type: 'json'
        },
        {
          cascadeDelete: true,
          collectionId: 'pbc_1095810794',
          hidden: false,
          id: 'relation3494172116',
          maxSelect: 1,
          minSelect: 0,
          name: 'session',
          presentable: false,
          required: false,
          system: false,
          type: 'relation'
        },
        {
          hidden: false,
          id: 'number2155046657',
          max: null,
          min: null,
          name: 'index',
          onlyInt: false,
          presentable: false,
          required: false,
          system: false,
          type: 'number'
        },
        {
          hidden: false,
          id: 'bool1023422721',
          name: 'is_completed',
          presentable: false,
          required: false,
          system: false,
          type: 'bool'
        },
        {
          hidden: false,
          id: 'autodate2990389176',
          name: 'created',
          onCreate: true,
          onUpdate: false,
          presentable: false,
          system: false,
          type: 'autodate'
        },
        {
          hidden: false,
          id: 'autodate3332085495',
          name: 'updated',
          onCreate: true,
          onUpdate: true,
          presentable: false,
          system: false,
          type: 'autodate'
        }
      ],
      indexes: [],
      system: false
    }
  }
}

export default sudokuSchemas
