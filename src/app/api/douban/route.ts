/* eslint-禁用 @typescript-eslint/no-explicit-any */

从“next”导入类型{Metadata，Viewport}；
从‘next/font/google’导入{Inter}；

导入'./globals.css';
导入 'sweetalert2/dist/sweetalert2.min.css';

从'@/lib/config'导入{getConfig}；
从'@/lib/runtime'导入RuntimeConfig；

从'../components/GlobalErrorIndicator'导入{GlobalErrorIndicator}；
从'../components/SiteProvider'导入{SiteProvider}；
从'../components/ThemeProvider'导入{ThemeProvider}；

const inter = Inter({ 子集：['latin'] });

// 动态生成元数据，支持配置更新后的标题变化
导出异步函数generateMetadata（）：Promise <Metadata> {
  让 siteName = process。env。SITE_NAME || 'MoonTV';
  如果 （
    process.env.NEXT_PUBLIC_STORAGE_TYPE !== 'd1' &&
    process。env。NEXT_PUBLIC_STORAGE_TYPE !== 'upstash'
  ）{
    const config = await getConfig();
    站点名称 = 配置。站点配置。站点名称;
  }

  返回 {
    标题：网站名称，
    描述： '影视聚合'，
    清单：'/manifest.json'，
    图标：{
      图标：'/favicon.png'，
    }，
  };
}

导出 const 视口：视口 = {
  主题颜色：'#000000'，
  viewportFit: '覆盖',
};

导出默认异步函数 RootLayout({
  孩子们，
}：{
  子项：React。ReactNode；
}) {
  让 siteName = process。env。SITE_NAME || 'MoonTV';
  让公告=
    process。env。公告 ||
    '本网站仅提供影视信息搜索服务，所有内容均来自第三方网站。本站不存储任何视频资源，不对任何内容的准确性、合法性、完整性负责。';
  让 enableRegister = process。env。NEXT_PUBLIC_ENABLE_REGISTER === 'true';
  让 imageProxy = process。env。NEXT_PUBLIC_IMAGE_PROXY || '';
  让 doubanProxy = process。env。NEXT_PUBLIC_DOUBAN_PROXY || '';
  让 disableYellowFilter =
    process。env。NEXT_PUBLIC_DISABLE_YELLOW_FILTER === 'true';
  让 customCategories =
    （RuntimeConfig 作为任何）。custom_category？。map（（category：任何）=>（{
      名称：'name' 在类别中？category。name : ''，
      类型：类别。类型，
      查询：category。query，
    })) || ([] 作为 Array<{ name: string; 输入: 'movie' | 'tv'; query: string }>);
  如果 （
    process.env.NEXT_PUBLIC_STORAGE_TYPE !== 'd1' &&
    process。env。NEXT_PUBLIC_STORAGE_TYPE !== 'upstash'
  ）{
    const config = await getConfig();
    站点名称 = 配置.站点配置.站点名称;
    公告 = 配置.站点配置.公告;
    启用注册 = 配置。用户配置.允许注册;
    图像代理 = 配置.站点配置.图像代理;
    doubanProxy = config.SiteConfig.DoubanProxy;
    禁用黄色过滤器 = config.SiteConfig.禁用黄色过滤器;
    自定义类别 = 配置.自定义类别.过滤器（
      (类别) => !category.disabled
    ).map((类别) => ({
      名称：类别.名称 || '',
      类型：类别.类型，
      查询：category.query，
    }））；
  }

  // 将运行时配置注入到全局窗口对象，供客户端在运行时读取
  const 运行时配置 = {
    存储类型： process.env.NEXT_PUBLIC_STORAGE_TYPE || 'localstorage'，
    ENABLE_REGISTER：启用注册，
    IMAGE_PROXY：图像代理，
    DOUBAN_PROXY: 豆瓣代理，
    DISABLE_YELLOW_FILTER：禁用黄色滤镜，
    CUSTOM_CATEGORIES：自定义类别，
  };

  返回 （
    <html lang='zh-CN' suppressHydrationWarning>
      <head>
        <元
          名称='视口'
          内容='宽度=设备宽度，初始比例=1.0，视口适合=覆盖'
        />
        <link rel='icon' href='/favicon.png' />
        <link rel='apple-touch-icon' href='/icons/icon-192x192.png' />
        {/* 将序列化后直接写入脚本，浏览器端可通过 window.RUNTIME_CONFIG 获取 */}
        {/* eslint-禁用下一行 @next/next/no-sync-scripts */}
        <脚本
          危险地设置内部HTML={{
            __html: `window.RUNTIME_CONFIG = ${JSON.stringify(runtimeConfig)};`,
          }}
        />
      </head>
      <正文
        className={`${inter.className} min-h-screen bg-white text-gray-900 dark:bg-black dark:text-gray-200`}
      >
        <主题提供程序
          属性='类'
          defaultTheme='系统'
          启用系统
          disableTransitionOnChange
        >
          <SiteProvider 站点名称={站点名称} 公告={公告}>
            {孩子们}
            <全局错误指示器 />
          </SiteProvider>
        </主题提供程序>
      </body>
    </html>
  （此处似有缺失，请提供更正后的文本）。
}
