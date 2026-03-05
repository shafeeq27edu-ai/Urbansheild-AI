import { logger } from '@/utils/logger';
import { ApiResponse } from '@/types';

interface FetchOptions extends RequestInit {
    timeout?: number;
    retries?: number;
}

export const apiClient = {
    async fetch<T>(url: string, options: FetchOptions = {}): Promise<ApiResponse<T>> {
        const { timeout = 8000, retries = 2, ...fetchOptions } = options;

        let delay = 1000;

        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                const controller = new AbortController();
                const id = setTimeout(() => controller.abort(), timeout);

                const response = await fetch(url, {
                    ...fetchOptions,
                    signal: controller.signal,
                    headers: {
                        'Content-Type': 'application/json',
                        ...fetchOptions.headers,
                    },
                });

                clearTimeout(id);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data: ApiResponse<T> = await response.json();
                return data;

            } catch (error: any) {
                logger.warn(`API request failed [Attempt ${attempt + 1}/${retries + 1}]: ${url}`, error.message);

                if (attempt === retries) {
                    logger.error(`API request permanently failed: ${url}`);
                    return {
                        success: false,
                        error: error.message || 'Unknown error occurred',
                        code: 'API_ERROR'
                    };
                }

                // Wait before retrying
                await new Promise(resolve => setTimeout(resolve, delay));
                delay += 1000;
            }
        }

        return { success: false, error: 'Maximum retries exceeded', code: 'API_ERROR' };
    }
};
