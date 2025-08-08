从‘next/server’导入{NextResponse}；

从'@/lib/config'导入{getCacheTime}；
从'@/lib/douban'导入{fetchDoubanData}；
从'@/lib/types'导入{DoubanItem，DoubanResult}；

豆瓣ApiResponse接口{
  主题：数组<{
    id：字符串；
    标题：字符串；
    封面：字符串；
    速率：字符串；
  }>;
}

导出 const 运行时 = 'edge';

导出异步函数 GET（请求：请求）{
  const {searchParams} = new URL(request.url);

  // 获取参数
  const 类型 = searchParams.get('类型');
  const tag = searchParams.get('标签');
  const pageSize = parseInt(searchParams.get('pageSize') || '16');
  const pageStart = parseInt(searchParams.get('pageStart') || '0');

  // 验证参数
  如果（！类型||！标签）{
    返回 NextResponse.json(
      { error: '缺少必要参数: type 或 tag' },
      { 状态：400 }
    （此处似有缺失，请提供更正后的文本）。
  }

  如果（！['电视'，'电影'].包括（类型））{
    返回 NextResponse.json(
      { error: 'type 参数必须是 tv 或 movie' },
      { 状态：400 }
    （此处似有缺失，请提供更正后的文本）。
  }

  如果（页面大小 < 1 || 页面大小 > 100）{
    返回 NextResponse.json(
      { error: 'pageSize 必须在 1-100 之间' },
      { 状态：400 }
    （此处似有缺失，请提供更正后的文本）。
  }

  如果（页面开始<0）{
    返回 NextResponse.json(
      { error: 'pageStart 不能小于 0' },
      { 状态：400 }
    （此处似有缺失，请提供更正后的文本）。
  }

  如果（标签 === 'top250'）{
    返回handleTop250（pageStart）；
  }

  const target = `https://movie.douban.com/j/search_subjects?type=${type}&tag=${tag}&sort=recommend&page_limit=${pageSize}&page_start=${pageStart}`;

  尝试 {
    //调用豆瓣API
    const doubanData = await fetchDoubanData<DoubanApiResponse>(target);

    // 转换数据格式
    const 列表: DoubanItem[] = doubanData.subjects.map((item) => ({
      id：商品id，
      标题：item.title，
      海报：item.cover，
      费率：item.rate，
      年： ''，
    }））；

    const 响应：豆瓣结果 = {
      代码：200，
      message: '获得成功',
      列表：列表，
    };

    const cacheTime = await getCacheTime();
    返回 NextResponse.json(响应，{
      标题：{
        'Cache-Control'：`public，max-age=${cacheTime}，s-maxage=${cacheTime}`，
        'CDN-Cache-Control'：`public，s-maxage=${cacheTime}`，
        'Vercel-CDN-Cache-Control'：`public，s-maxage=${cacheTime}`，
      }，
    });
  } 捕获（错误）{
    返回 NextResponse.json(
      { error: '获取豆瓣数据失败', 详细信息: (error as Error).message },
      { 状态： 500 }
    （此处似有缺失，请提供更正后的文本）。
  }
}

函数handleTop250（pageStart：number）{
  const target = `https://movie.douban.com/top250?start=${pageStart}&filter=`;

  // 直接使用fetch获取HTML页面
  const 控制器 = new AbortController();
  const timeoutId = setTimeout(() => 控制器.abort(), 10000);

  const fetchOptions = {
    信号：控制器.信号，
    标题：{
      ‘用户代理’：
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, 如 Gecko) Chrome/121.0.0.0 Safari/537.36'，
      推荐人：'https://movie.douban.com/',
      接受：
        '文本/html，应用程序/xhtml+xml，应用程序/xml；q=0.9，图像/webp，*/*；q=0.8'，
    }，
  };

  返回 fetch(target, fetchOptions)
    .键，然后(async (fetchResponse) => {
      清除超时（超时ID）；

      如果（！fetchResponse.ok）{
        抛出新的错误（`HTTP 错误！状态：${fetchResponse。status}`）；
      }

      // 获取HTML内容
      const html = await fetchResponse。text();

      // 通过正则同时捕获影片id、标题、封面以及评分
      const moviePattern =
        /<div class="item">[\s\S]*?<a[^>]+href="https?:\/\/movie\.douban\.com\/subject\/(\d+)\/">[\s\S]*?<img[^>]+alt="([^"]+)">[^>]*src="([^"]+)">[\s\S]*?<span class="rating_num"><^>]*>([^<]*)<\/span>[\s\S]*?<\/div>/g;
      const 电影: DoubanItem[] = [];
      让匹配；

      while ((match = moviePattern.exec(html)) !== null) {
        const id = match[1];
        const 标题 = 匹配[2];
        const cover = match[3];
        const rate = match[4] || '';

        // 处理图片URL，确保使用HTTPS
        const processedCover = cover.replace(/^http:/, 'https:');

        电影.推（{
          id： id，
          标题：标题，
          海报：processedCover，
          费率：费率，
          年： ''，
        });
      }

      const apiResponse: 豆瓣结果 = {
        代码：200，
        message: '获得成功'，
        列表：电影，
      };

      const cacheTime = await getCacheTime();
      返回 NextResponse。json(apiResponse，{
        标题：{
          'Cache-Control'：`public，max-age=${cacheTime}，s-maxage=${cacheTime}`，
          'CDN-Cache-Control'：`public，s-maxage=${cacheTime}`，
          'Vercel-CDN-Cache-Control'：`public，s-maxage=${cacheTime}`，
        }，
      });
    })
    。catch((错误) => {
      清除超时（超时ID）；
      返回 NextResponse.json(
        {
          error: '获取豆瓣Top250数据失败'，
          详细信息：（错误为 Error）.message，
        }，
        { 状态： 500 }
      （此处似有缺失，请提供更正后的文本）。
    });
}
