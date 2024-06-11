import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ScoreRecord } from 'Models/ScoreRecord';
import { getLeaderboardsRequest } from '../../lib/api/http/requests/chaos';

export const getLeaderboards = createAsyncThunk('chaosData/getLeaderboards', async (_params, thunkAPI) => {
  try {
    const { data } = await getLeaderboardsRequest();
    if (data && data.documents) {
      return data.documents;
    } else {
      console.error('Something wrong with chaosData/getLeaderboards');
      return thunkAPI.rejectWithValue('');
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
});

type ChaosSliceType = {
  lastRun: { lastRecord: ScoreRecord | null; bestRecord: ScoreRecord | null; score: number | null };
  leaderboards: Array<{
    levelId: string;
    records: ScoreRecord[];
  }>;
  meta: {
    leaderboardsLoading: boolean;
  };
};

const initialState: ChaosSliceType = {
  lastRun: { lastRecord: null, bestRecord: null, score: null },
  leaderboards: [],
  meta: {
    leaderboardsLoading: false,
  },
};

const chaosSlice = createSlice({
  name: 'chaosData',
  initialState,

  reducers: {
    setLastRun: (state, action) => {
      state.lastRun = action.payload;
    },
    resetLastRun: (state) => {
      state.lastRun = { lastRecord: null, bestRecord: null, score: null };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getLeaderboards.fulfilled, (state, action) => {
      state.leaderboards = action.payload;
      state.meta.leaderboardsLoading = false;
    });
    builder.addCase(getLeaderboards.pending, (state) => {
      state.meta.leaderboardsLoading = true;
    });
    builder.addCase(getLeaderboards.rejected, (state) => {
      state.leaderboards = [];
      state.meta.leaderboardsLoading = false;
    });
  },
});

export const { setLastRun, resetLastRun } = chaosSlice.actions;

export default chaosSlice.reducer;
