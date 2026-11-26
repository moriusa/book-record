const widgetDocument = `<!doctype html>
<html lang="ja">
<head><meta charset="utf-8"><meta name="viewport" content="width=300"><style>html,body{margin:0;padding:0;width:300px;height:250px;overflow:hidden}</style></head>
<body>
<script>rakuten_design="slide";rakuten_affiliateId="59fc6877.14972822.59fc6878.f932143e";rakuten_items="ctsmatch";rakuten_genreId="0";rakuten_size="300x250";rakuten_target="_blank";rakuten_theme="gray";rakuten_border="off";rakuten_auto_mode="on";rakuten_genre_title="off";rakuten_recommend="on";rakuten_ts="1795652809684";</script>
<script src="https://xml.affiliate.rakuten.co.jp/widget/js/rakuten_widget.js?20230106"></script>
</body></html>`;

export default function RakutenAffiliateWidget() {
  return (
    <section
      aria-label="広告"
      className="mt-12 border-t border-[#293630]/12 pt-8 sm:mt-16"
    >
      <p className="mb-3 text-xs tracking-[0.08em] text-[#75817a]">広告</p>
      <div className="max-w-full overflow-x-auto">
        <iframe
          title="楽天アフィリエイト広告"
          srcDoc={widgetDocument}
          width="300"
          height="250"
          loading="lazy"
          className="block max-w-none border-0"
        />
      </div>
    </section>
  );
}
