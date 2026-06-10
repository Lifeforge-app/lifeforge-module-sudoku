export const contract = {
  generateBoard: {
    method: 'get',
    description: 'Generate Sudoku boards from external API',
    noAuth: false,
    encrypted: true,
    isDownloadable: false,
    media: null,
    input: {
      query: {
        $schema: 'https://json-schema.org/draft/2020-12/schema',
        type: 'object',
        properties: {
          difficulty: {
            type: 'string',
            enum: ['easy', 'medium', 'hard', 'expert', 'evil', 'extreme']
          },
          count: {
            default: '6',
            type: 'string'
          }
        },
        required: ['difficulty', 'count'],
        additionalProperties: false
      }
    },
    output: {
      OK: {
        $schema: 'https://json-schema.org/draft/2020-12/schema',
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: {
              type: 'number'
            },
            mission: {
              type: 'string'
            },
            solution: {
              type: 'string'
            },
            win_rate: {
              type: 'number'
            }
          },
          required: ['id', 'mission', 'solution', 'win_rate'],
          additionalProperties: false
        }
      }
    }
  },
  sessions: {
    create: {
      method: 'post',
      description: 'Create a new Sudoku session',
      noAuth: false,
      encrypted: true,
      isDownloadable: false,
      media: null,
      input: {
        body: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            difficulty: {
              type: 'string',
              enum: ['easy', 'medium', 'hard', 'expert', 'evil', 'extreme']
            },
            boardCount: {
              type: 'number',
              minimum: 1,
              maximum: 6
            }
          },
          required: ['difficulty', 'boardCount'],
          additionalProperties: false
        }
      },
      output: {
        OK: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            sessionId: {
              type: 'string'
            },
            boards: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'number'
                  },
                  mission: {
                    type: 'string'
                  },
                  solution: {
                    type: 'string'
                  },
                  win_rate: {
                    type: 'number'
                  }
                },
                required: ['id', 'mission', 'solution', 'win_rate'],
                additionalProperties: false
              }
            }
          },
          required: ['sessionId', 'boards'],
          additionalProperties: false
        }
      }
    },
    get: {
      method: 'get',
      description: 'Get a specific Sudoku session',
      noAuth: false,
      encrypted: true,
      isDownloadable: false,
      media: null,
      input: {
        query: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            id: {
              type: 'string'
            }
          },
          required: ['id'],
          additionalProperties: false
        }
      },
      output: {
        OK: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            session: {
              type: 'object',
              properties: {
                current_board_index: {
                  type: 'number'
                },
                created: {
                  type: 'string'
                },
                updated: {
                  type: 'string'
                },
                id: {
                  type: 'string'
                },
                collectionId: {
                  type: 'string'
                },
                collectionName: {
                  type: 'string'
                }
              },
              required: [
                'current_board_index',
                'created',
                'updated',
                'id',
                'collectionId',
                'collectionName'
              ],
              additionalProperties: false
            },
            entries: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  difficulty: {
                    type: 'string'
                  },
                  duration_elapsed: {
                    type: 'number'
                  },
                  board: {},
                  user_answers: {},
                  user_candidates: {},
                  session: {
                    type: 'string'
                  },
                  index: {
                    type: 'number'
                  },
                  is_completed: {
                    type: 'boolean'
                  },
                  created: {
                    type: 'string'
                  },
                  updated: {
                    type: 'string'
                  },
                  id: {
                    type: 'string'
                  },
                  collectionId: {
                    type: 'string'
                  },
                  collectionName: {
                    type: 'string'
                  }
                },
                required: [
                  'difficulty',
                  'duration_elapsed',
                  'board',
                  'user_answers',
                  'user_candidates',
                  'session',
                  'index',
                  'is_completed',
                  'created',
                  'updated',
                  'id',
                  'collectionId',
                  'collectionName'
                ],
                additionalProperties: false
              }
            }
          },
          required: ['session', 'entries'],
          additionalProperties: false
        },
        NOT_FOUND: true
      }
    },
    getActive: {
      method: 'get',
      description: 'Get the active Sudoku session',
      noAuth: false,
      encrypted: true,
      isDownloadable: false,
      media: null,
      input: {},
      output: {
        OK: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          anyOf: [
            {
              type: 'object',
              properties: {
                session: {
                  type: 'object',
                  properties: {
                    current_board_index: {
                      type: 'number'
                    },
                    created: {
                      type: 'string'
                    },
                    updated: {
                      type: 'string'
                    },
                    id: {
                      type: 'string'
                    },
                    collectionId: {
                      type: 'string'
                    },
                    collectionName: {
                      type: 'string'
                    }
                  },
                  required: [
                    'current_board_index',
                    'created',
                    'updated',
                    'id',
                    'collectionId',
                    'collectionName'
                  ],
                  additionalProperties: false
                },
                entries: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      difficulty: {
                        type: 'string'
                      },
                      duration_elapsed: {
                        type: 'number'
                      },
                      board: {},
                      user_answers: {},
                      user_candidates: {},
                      session: {
                        type: 'string'
                      },
                      index: {
                        type: 'number'
                      },
                      is_completed: {
                        type: 'boolean'
                      },
                      created: {
                        type: 'string'
                      },
                      updated: {
                        type: 'string'
                      },
                      id: {
                        type: 'string'
                      },
                      collectionId: {
                        type: 'string'
                      },
                      collectionName: {
                        type: 'string'
                      }
                    },
                    required: [
                      'difficulty',
                      'duration_elapsed',
                      'board',
                      'user_answers',
                      'user_candidates',
                      'session',
                      'index',
                      'is_completed',
                      'created',
                      'updated',
                      'id',
                      'collectionId',
                      'collectionName'
                    ],
                    additionalProperties: false
                  }
                }
              },
              required: ['session', 'entries'],
              additionalProperties: false
            },
            {
              type: 'null'
            }
          ]
        }
      }
    },
    getActivities: {
      method: 'get',
      description: 'Get Sudoku activities for calendar',
      noAuth: false,
      encrypted: true,
      isDownloadable: false,
      media: null,
      input: {
        query: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            year: {
              type: 'string'
            }
          },
          required: ['year'],
          additionalProperties: false
        }
      },
      output: {
        OK: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  date: {
                    type: 'string'
                  },
                  count: {
                    type: 'number'
                  },
                  level: {
                    type: 'number'
                  }
                },
                required: ['date', 'count', 'level'],
                additionalProperties: false
              }
            },
            firstYear: {
              type: 'number'
            }
          },
          required: ['data', 'firstYear'],
          additionalProperties: false
        }
      }
    },
    list: {
      method: 'get',
      description: 'List all Sudoku sessions',
      noAuth: false,
      encrypted: true,
      isDownloadable: false,
      media: null,
      input: {
        query: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            difficulty: {
              type: 'string'
            }
          },
          additionalProperties: false
        }
      },
      output: {
        OK: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string'
              },
              difficulty: {
                type: 'string'
              },
              boardCount: {
                type: 'number'
              },
              currentBoardIndex: {
                type: 'number'
              },
              progress: {
                type: 'object',
                properties: {
                  total: {
                    type: 'number'
                  },
                  filled: {
                    type: 'number'
                  },
                  correct: {
                    type: 'number'
                  }
                },
                required: ['total', 'filled', 'correct'],
                additionalProperties: false
              },
              totalDuration: {
                type: 'number'
              },
              created: {
                type: 'string'
              },
              updated: {
                type: 'string'
              }
            },
            required: [
              'id',
              'difficulty',
              'boardCount',
              'currentBoardIndex',
              'progress',
              'totalDuration',
              'created',
              'updated'
            ],
            additionalProperties: false
          }
        }
      }
    },
    markComplete: {
      method: 'post',
      description: 'Mark a Sudoku board as completed',
      noAuth: false,
      encrypted: true,
      isDownloadable: false,
      media: null,
      input: {
        body: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            sessionId: {
              type: 'string'
            },
            boardIndex: {
              type: 'number'
            }
          },
          required: ['sessionId', 'boardIndex'],
          additionalProperties: false
        }
      },
      output: {
        OK: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            success: {
              type: 'boolean'
            }
          },
          required: ['success'],
          additionalProperties: false
        },
        BAD_REQUEST: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'string'
        }
      }
    },
    remove: {
      method: 'post',
      description: 'Delete Sudoku session',
      noAuth: false,
      encrypted: true,
      isDownloadable: false,
      media: null,
      input: {
        query: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            id: {
              type: 'string'
            }
          },
          required: ['id'],
          additionalProperties: false
        }
      },
      output: {
        NO_CONTENT: true,
        NOT_FOUND: true
      }
    },
    resetBoard: {
      method: 'post',
      description: 'Reset a Sudoku board to initial state',
      noAuth: false,
      encrypted: true,
      isDownloadable: false,
      media: null,
      input: {
        body: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            sessionId: {
              type: 'string'
            },
            boardIndex: {
              type: 'number'
            }
          },
          required: ['sessionId', 'boardIndex'],
          additionalProperties: false
        }
      },
      output: {
        OK: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            success: {
              type: 'boolean'
            }
          },
          required: ['success'],
          additionalProperties: false
        },
        BAD_REQUEST: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'string'
        }
      }
    },
    save: {
      method: 'post',
      description: 'Save Sudoku session progress',
      noAuth: false,
      encrypted: true,
      isDownloadable: false,
      media: null,
      input: {
        body: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            sessionId: {
              type: 'string'
            },
            currentBoardIndex: {
              type: 'number'
            },
            difficulty: {
              type: 'string'
            },
            boards: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'number'
                  },
                  mission: {
                    type: 'string'
                  },
                  solution: {
                    type: 'string'
                  },
                  win_rate: {
                    type: 'number'
                  }
                },
                required: ['id', 'mission', 'solution', 'win_rate'],
                additionalProperties: false
              }
            },
            userInputs: {
              type: 'array',
              items: {
                type: 'array',
                items: {
                  type: 'string'
                }
              }
            },
            candidates: {
              type: 'array',
              items: {
                type: 'array',
                items: {
                  type: 'array',
                  items: {
                    type: 'number'
                  }
                }
              }
            },
            durationsElapsed: {
              default: [],
              type: 'array',
              items: {
                type: 'number'
              }
            }
          },
          required: [
            'currentBoardIndex',
            'difficulty',
            'boards',
            'userInputs',
            'candidates',
            'durationsElapsed'
          ],
          additionalProperties: false
        }
      },
      output: {
        OK: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            sessionId: {
              type: 'string'
            }
          },
          required: ['sessionId'],
          additionalProperties: false
        }
      }
    },
    stats: {
      method: 'get',
      description: 'Get Sudoku statistics',
      noAuth: false,
      encrypted: true,
      isDownloadable: false,
      media: null,
      input: {},
      output: {
        OK: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            overall: {
              type: 'object',
              properties: {
                totalBoards: {
                  type: 'number'
                },
                totalPlayTime: {
                  type: 'number'
                },
                daysPlayed: {
                  type: 'number'
                }
              },
              required: ['totalBoards', 'totalPlayTime', 'daysPlayed'],
              additionalProperties: false
            },
            streak: {
              type: 'object',
              properties: {
                current: {
                  type: 'number'
                },
                longest: {
                  type: 'number'
                },
                isActive: {
                  type: 'boolean'
                }
              },
              required: ['current', 'longest', 'isActive'],
              additionalProperties: false
            },
            byDifficulty: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  difficulty: {
                    type: 'string'
                  },
                  totalBoards: {
                    type: 'number'
                  },
                  avgTime: {
                    anyOf: [
                      {
                        type: 'number'
                      },
                      {
                        type: 'null'
                      }
                    ]
                  },
                  bestTime: {
                    anyOf: [
                      {
                        type: 'number'
                      },
                      {
                        type: 'null'
                      }
                    ]
                  },
                  totalTime: {
                    type: 'number'
                  },
                  timeDistribution: {
                    type: 'object',
                    properties: {
                      under2min: {
                        type: 'number'
                      },
                      under5min: {
                        type: 'number'
                      },
                      under10min: {
                        type: 'number'
                      },
                      under20min: {
                        type: 'number'
                      },
                      over20min: {
                        type: 'number'
                      }
                    },
                    required: [
                      'under2min',
                      'under5min',
                      'under10min',
                      'under20min',
                      'over20min'
                    ],
                    additionalProperties: false
                  }
                },
                required: [
                  'difficulty',
                  'totalBoards',
                  'avgTime',
                  'bestTime',
                  'totalTime',
                  'timeDistribution'
                ],
                additionalProperties: false
              }
            },
            completionHistory: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  month: {
                    type: 'string'
                  },
                  completed: {
                    type: 'number'
                  },
                  total: {
                    type: 'number'
                  },
                  rate: {
                    type: 'number'
                  }
                },
                required: ['month', 'completed', 'total', 'rate'],
                additionalProperties: false
              }
            },
            recentActivity: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  date: {
                    type: 'string'
                  },
                  count: {
                    type: 'number'
                  }
                },
                required: ['date', 'count'],
                additionalProperties: false
              }
            }
          },
          required: [
            'overall',
            'streak',
            'byDifficulty',
            'completionHistory',
            'recentActivity'
          ],
          additionalProperties: false
        }
      }
    }
  }
} as const

export default contract
