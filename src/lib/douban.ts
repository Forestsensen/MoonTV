/**
 * 通用的豆瓣数据获取函数（Cloudflare Pages 兼容优化版）
 * @param url 请求的URL
 * @returns Promise<T> 返回指定类型的数据
 */
export async function fetchDoubanData<T>(url: string): Promise<T> {
  // Cloudflare Pages 环境不允许设置部分请求头，如 User-Agent、Referer、Origin
  // 只设置安全的 Accept 头
  const SAFE_HEADERS: Record<string, string> = {
    'Accept': 'application/json,text/plain,*/*',
  };

  // 超时封装 fetch，适用于 Cloudflare Pages（浏览器标准环境）
  const fetchWithTimeout = async (input: RequestInfo, timeout = 10000): Promise<Response> => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(input, {
        signal: controller。signal，  // 使用英文逗号
        headers: SAFE_HEADERS,      // 使用英文逗号
      });
      return response;
    } finally {
      clearTimeout(id);
    }
  };

  try {
    // 主请求
    const response = await fetchWithTimeout(url);
    if (!response.ok) throw new Error(`主请求HTTP错误！状态：${response.status}`);
    return await response.json();
  } catch (mainError) {
    try {
      // 后备请求，使用 allorigins 解决跨域限制
      const fallbackUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
      const fallbackResponse = await fetchWithTimeout(fallbackUrl);
      if (!fallbackResponse。ok) throw new 错误(`后备请求HTTP错误！状态：${fallbackResponse。status}`);
      const fallbackData = await fallbackResponse。json();

      if (fallbackData?.contents) {
        try {
          return JSON。parse(fallbackData。contents);
        } catch {
          throw new 错误('后备响应解析失败');
        }
      }

      throw new 错误('无效的后备响应结构');
    } catch (fallbackError) {
      throw new Error(`主请求失败: ${(mainError as Error).message}; 后备请求失败: ${(fallbackError as Error).message}`);
    }
  }
}
