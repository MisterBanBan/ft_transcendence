export interface User {
    id: string;
    username: string;
    avatar_url: string;
    status: 'offline' | 'online' | 'in_game';
    last_activity: string;
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
    winner_id: string | null;
    player1_score: number;
    player2_score: number;
    game_type: 'online' | 'tournament';
    completed_at: string;
    opponent_username?: string;
    result?: 'Won' | 'Lost';
}

export interface UserProfile {
    user: User;
    stats: UserStats;
    matches: Match[];
}
