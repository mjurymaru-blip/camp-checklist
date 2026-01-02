
import { useState, useEffect } from 'react';

const LIMIT_PER_DAY = 10;
const STORAGE_KEY = 'camp_ai_usage_limit';

interface UsageData {
    date: string; // 'YYYY-MM-DD'
    count: number;
}

export const useRateLimiter = () => {
    const [usage, setUsage] = useState<UsageData>({ date: '', count: 0 });

    // Load initial state
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const data: UsageData = JSON.parse(stored);
                if (data.date === today) {
                    setUsage(data);
                } else {
                    // Reset for new day
                    const newData = { date: today, count: 0 };
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
                    setUsage(newData);
                }
            } catch (e) {
                console.error('Failed to parse usage data', e);
                const newData = { date: today, count: 0 };
                localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
                setUsage(newData);
            }
        } else {
            const newData = { date: today, count: 0 };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
            setUsage(newData);
        }
    }, []);

    const checkLimit = (): boolean => {
        const today = new Date().toISOString().split('T')[0];
        const stored = localStorage.getItem(STORAGE_KEY);

        if (stored) {
            const data = JSON.parse(stored);
            if (data.date === today) {
                return data.count < LIMIT_PER_DAY;
            }
        }
        // If no data or new day, it returns true (count is 0)
        return true;
    };

    const incrementUsage = () => {
        const today = new Date().toISOString().split('T')[0];
        const stored = localStorage.getItem(STORAGE_KEY);
        let newCount = 1;

        if (stored) {
            const data = JSON.parse(stored);
            if (data.date === today) {
                newCount = data.count + 1;
            }
        }

        const newData = { date: today, count: newCount };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
        setUsage(newData);
    };

    return {
        checkLimit,
        incrementUsage,
        remaining: Math.max(0, LIMIT_PER_DAY - usage.count),
        limit: LIMIT_PER_DAY,
        usageCount: usage.count
    };
};
