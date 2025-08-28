export interface User {
    id: string;
    username: string;
    avatar_url: string;
    status?: 'offline' | 'online' | 'in_game';
    last_activity?: string;
}

export interface UserStats {
    user_id: string;
    total_games: number;
    wins: number;
    losses: number;
    total_points_scored: number;
    total_points_conceded: number;
    win_rate: number;
    created_at: string;
    updated_at: string;
}

export interface Match {
    id: string;
    player1_id: string;
    player2_id: string;
    player1_score: number;
    player2_score: number;
    winner_id: string | null;
    completed_at: string;
    opponent_username: string;
    result: 'Won' | 'Lost' | 'Draw';
}

export interface UserProfile {
    user: User;
    stats: UserStats;
    matches: Match[];
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export interface MatchesResponse {
    matches: Match[];
    pagination: {
        page: number;
        limit: number;
        hasMore: boolean;
    };
}
