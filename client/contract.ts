export type EndpointGenerateBoard_OutputOK = {
  id: number;
  mission: string;
  solution: string;
  win_rate: number;
}[];
export type EndpointSessionsGetActive_OutputOK = {
  session: {
    id: string;
    current_board_index: number;
    created: string;
    updated: string;
  };
  entries: {
    id: string;
    difficulty: string;
    duration_elapsed: number;
    board: {
      id: number;
      mission: string;
      solution: string;
      win_rate: number;
    } | null;
    user_answers: string[];
    user_candidates: number[][];
    session: string | null;
    index: number;
    is_completed: boolean;
    created: string;
    updated: string;
  }[];
} | null;
export type EndpointSessionsList_OutputOK = {
  id: string;
  difficulty: string;
  boardCount: number;
  currentBoardIndex: number;
  progress: {
    total: number;
    filled: number;
    correct: number;
  };
  totalDuration: number;
  created: string;
  updated: string;
}[];
export type EndpointSessionsRemove_OutputNO_CONTENT = void;

export interface Contract {
  generateBoard: EndpointGenerateBoard;
  sessions: {
    create: EndpointSessionsCreate;
    get: EndpointSessionsGet;
    getActive: EndpointSessionsGetActive;
    getActivities: EndpointSessionsGetActivities;
    list: EndpointSessionsList;
    markComplete: EndpointSessionsMarkComplete;
    remove: EndpointSessionsRemove;
    resetBoard: EndpointSessionsResetBoard;
    save: EndpointSessionsSave;
    stats: EndpointSessionsStats;
  };
}
export interface EndpointGenerateBoard {
  method: "get";
  input: {
    query?: EndpointGenerateBoard_InputQuery;
  };
  output: {
    OK: EndpointGenerateBoard_OutputOK;
  };
  media: null;
}
export interface EndpointGenerateBoard_InputQuery {
  difficulty: "easy" | "medium" | "hard" | "expert" | "evil" | "extreme";
  count: string;
}
export interface EndpointSessionsCreate {
  method: "post";
  input: {
    body?: EndpointSessionsCreate_InputBody;
  };
  output: {
    OK: EndpointSessionsCreate_OutputOK;
  };
  media: null;
}
export interface EndpointSessionsCreate_InputBody {
  difficulty: "easy" | "medium" | "hard" | "expert" | "evil" | "extreme";
  boardCount: number;
}
export interface EndpointSessionsCreate_OutputOK {
  sessionId: string;
  boards: {
    id: number;
    mission: string;
    solution: string;
    win_rate: number;
  }[];
}
export interface EndpointSessionsGet {
  method: "get";
  input: {
    query?: EndpointSessionsGet_InputQuery;
  };
  output: {
    OK: EndpointSessionsGet_OutputOK;
  };
  media: null;
}
export interface EndpointSessionsGet_InputQuery {
  id: string;
}
export interface EndpointSessionsGet_OutputOK {
  session: {
    id: string;
    current_board_index: number;
    created: string;
    updated: string;
  };
  entries: {
    id: string;
    difficulty: string;
    duration_elapsed: number;
    board: {
      id: number;
      mission: string;
      solution: string;
      win_rate: number;
    } | null;
    user_answers: string[];
    user_candidates: number[][];
    session: string | null;
    index: number;
    is_completed: boolean;
    created: string;
    updated: string;
  }[];
}
export interface EndpointSessionsGetActive {
  method: "get";
  input: {};
  output: {
    OK: EndpointSessionsGetActive_OutputOK;
  };
  media: null;
}
export interface EndpointSessionsGetActivities {
  method: "get";
  input: {
    query?: EndpointSessionsGetActivities_InputQuery;
  };
  output: {
    OK: EndpointSessionsGetActivities_OutputOK;
  };
  media: null;
}
export interface EndpointSessionsGetActivities_InputQuery {
  year: string;
}
export interface EndpointSessionsGetActivities_OutputOK {
  data: {
    date: string;
    count: number;
    level: number;
  }[];
  firstYear: number;
}
export interface EndpointSessionsList {
  method: "get";
  input: {
    query?: EndpointSessionsList_InputQuery;
  };
  output: {
    OK: EndpointSessionsList_OutputOK;
  };
  media: null;
}
export interface EndpointSessionsList_InputQuery {
  difficulty?: string;
}
export interface EndpointSessionsMarkComplete {
  method: "post";
  input: {
    body?: EndpointSessionsMarkComplete_InputBody;
  };
  output: {
    OK: EndpointSessionsMarkComplete_OutputOK;
  };
  media: null;
}
export interface EndpointSessionsMarkComplete_InputBody {
  sessionId: string;
  boardIndex: number;
}
export interface EndpointSessionsMarkComplete_OutputOK {
  success: boolean;
}
export interface EndpointSessionsRemove {
  method: "post";
  input: {
    query?: EndpointSessionsRemove_InputQuery;
  };
  output: {
    NO_CONTENT: EndpointSessionsRemove_OutputNO_CONTENT;
  };
  media: null;
}
export interface EndpointSessionsRemove_InputQuery {
  id: string;
}
export interface EndpointSessionsResetBoard {
  method: "post";
  input: {
    body?: EndpointSessionsResetBoard_InputBody;
  };
  output: {
    OK: EndpointSessionsResetBoard_OutputOK;
  };
  media: null;
}
export interface EndpointSessionsResetBoard_InputBody {
  sessionId: string;
  boardIndex: number;
}
export interface EndpointSessionsResetBoard_OutputOK {
  success: boolean;
}
export interface EndpointSessionsSave {
  method: "post";
  input: {
    body?: EndpointSessionsSave_InputBody;
  };
  output: {
    OK: EndpointSessionsSave_OutputOK;
  };
  media: null;
}
export interface EndpointSessionsSave_InputBody {
  sessionId?: string;
  currentBoardIndex: number;
  difficulty: string;
  boards: {
    id: number;
    mission: string;
    solution: string;
    win_rate: number;
  }[];
  userInputs: string[][];
  candidates: number[][][];
  durationsElapsed: number[];
}
export interface EndpointSessionsSave_OutputOK {
  sessionId: string;
}
export interface EndpointSessionsStats {
  method: "get";
  input: {};
  output: {
    OK: EndpointSessionsStats_OutputOK;
  };
  media: null;
}
export interface EndpointSessionsStats_OutputOK {
  overall: {
    totalBoards: number;
    totalPlayTime: number;
    daysPlayed: number;
  };
  streak: {
    current: number;
    longest: number;
    isActive: boolean;
  };
  byDifficulty: {
    difficulty: string;
    totalBoards: number;
    avgTime: number | null;
    bestTime: number | null;
    totalTime: number;
    timeDistribution: {
      under2min: number;
      under5min: number;
      under10min: number;
      under20min: number;
      over20min: number;
    };
  }[];
  completionHistory: {
    month: string;
    completed: number;
    total: number;
    rate: number;
  }[];
  recentActivity: {
    date: string;
    count: number;
  }[];
}
