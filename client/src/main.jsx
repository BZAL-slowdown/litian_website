import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { Link, NavLink, Route, BrowserRouter as Router, Routes, useParams } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  ClipboardList,
  Edit3,
  Home,
  LayoutDashboard,
  LogIn,
  Menu,
  Phone,
  Save,
  ShieldCheck,
  UserPlus,
  Users
} from "lucide-react";
import { api } from "./api";
import "./styles.css";

const BANNERS = [
  "https://demoall2.5fa.cn/849/public/upload/other/2018/08/23/d90465bd6aacf7163074a82880f12c78.jpg",
  "https://demoall2.5fa.cn/849/public/upload/other/2018/08/23/1b9777a0ad8a52a71d4202f5f47f2fb4.png"
];

const PRODUCT_IMAGES = [
  "https://demoall2.5fa.cn/849/public/upload/article/2018/08/23/362eb29c769a210f405bd6d30082d336.jpg",
  "https://demoall2.5fa.cn/849/public/upload/article/2018/08/23/ea8f3fb96c7afb0f0bad0895ac31ba2b.jpg",
  "https://demoall2.5fa.cn/849/public/upload/article/2018/08/23/b3c865b3d2f95e3a0e06892b09485686.jpg",
  "https://demoall2.5fa.cn/849/public/upload/article/2018/08/23/0239229e472453dcb6e193c38260ff0a.jpg",
  "https://demoall2.5fa.cn/849/public/upload/article/2018/08/23/9735ed2d4cea968f5578d3cbdf5bca35.jpg",
  "https://demoall2.5fa.cn/849/public/upload/article/2018/08/23/30f943e0ae55cf48b4c0482ea48ece58.jpg",
  "https://demoall2.5fa.cn/849/public/upload/article/2018/08/23/8764f281f738be9bdb6671c2bf868e2d.jpg",
  "https://demoall2.5fa.cn/849/public/upload/article/2018/08/23/2280ef172d06e6bc8aa28aaacf20dd1a.jpg"
];

const ABOUT_IMAGES = [
  "https://demoall2.5fa.cn/849/public/upload/other/2018/08/23/f19be075d5b9906e351e98add50edeec.jpg",
  "https://demoall2.5fa.cn/849/public/upload/other/2018/08/23/67bd1b5f8c9d756416c51b508446a5ba.jpg"
];

const TEAM_IMAGES = [
  "https://demoall2.5fa.cn/849/public/upload/article/2018/08/23/b9c630e0420384590f4f335a065dccb1.jpg",
  "https://demoall2.5fa.cn/849/public/upload/article/2018/08/23/a3bd32dda4ea7aad63f6b81de7810c6f.jpg",
  "https://demoall2.5fa.cn/849/public/upload/article/2018/08/23/c567ed953904f24b7d04a9f91e72ba68.jpg",
  "https://demoall2.5fa.cn/849/public/upload/article/2018/08/23/38dac1d71c6b38e796e8acf273164fa2.jpg",
  "https://demoall2.5fa.cn/849/public/upload/article/2018/08/23/514b7d67602cdd909c09f10421d273a4.jpg"
];

const CASE_IMAGES = [
  "https://demoall2.5fa.cn/849/public/upload/article/2018/08/23/022318a803e6fe5d9ab644818abfb354.jpg",
  "https://demoall2.5fa.cn/849/public/upload/article/2018/08/23/e18552c13963e6995d472690eb4b2a16.jpg",
  "https://demoall2.5fa.cn/849/public/upload/article/2018/08/23/06d09e966ce1e5109e1c66ae3f2c7a1f.jpg",
  "https://demoall2.5fa.cn/849/public/upload/article/2018/08/23/af84853ca0fea1cf1f89c95d899b0595.jpg",
  "https://demoall2.5fa.cn/849/public/upload/article/2018/08/23/3d53fb7ac82201cefbe274d07770941d.jpg"
];

const NEWS_IMAGES = [
  "https://demoall2.5fa.cn/849/public/upload/article/2018/08/23/57649cc97b9f2194c1403d86d106411f.jpg",
  "https://demoall2.5fa.cn/849/public/upload/article/2018/08/23/2f59d45c3a8895e5007cb70d0aef354b.jpg",
  "https://demoall2.5fa.cn/849/public/upload/article/2018/08/23/2b105f1be27c741d13d5fac425cec24d.jpg"
];

const FOOTER_BG = "https://demoall2.5fa.cn/849/template/pc/skin/images/foot-bg.jpg";
const QR_IMAGE = "https://demoall2.5fa.cn/849/uploads/allimg/20230608/1-23060P92305115.jpg";

const PRODUCT_ITEMS = [
  "产品名称九",
  "产品名称八",
  "产品名称七",
  "产品名称六",
  "产品名称五",
  "产品名称四",
  "产品名称三",
  "产品名称二"
];

const TEAM_ITEMS = [
  ["设计师-赵", "从事公共装饰装修、装饰材料、家具配套设计多年。"],
  ["设计师-陈", "从事公共装饰装修、装饰材料、家具配套设计多年。"],
  ["设计师-王", "从事公共装饰装修、装饰材料、家具配套设计多年。"],
  ["设计师-李", "从事公共装饰装修、装饰材料、家具配套设计多年。"]
];

const CASE_ITEMS = ["展示五", "展示四", "展示三", "展示二"];

const NEWS_ITEMS = [
  ["客厅影视墙和卧室背景墙应该如何设计？", "电视背景墙应该是每家每户装修时都不会忽略的一环，毕竟每天晚饭后，一家人坐在电视前......"],
  ["卧室、阳台多功能储物柜设计真实用 家装变", "卧室、阳台多功能储物柜对于我们的家庭来说真的很实用，它可以帮助我们收纳更多的东西......"],
  ["掌握这些婚房装修小技巧 保证您的婚后生活", "有没有经历过选购了心仪的窗帘之后，买回家却发现安装不了，或者说是不合适的问题，在......"]
];

function useSite() {
  const [site, setSite] = useState({ pages: [], cases: [], notices: [] });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.site().then(setSite).finally(() => setLoading(false));
  }, []);
  return { site, loading };
}

function Shell({ children, showSimpleFooter = true }) {
  const [open, setOpen] = useState(false);
  const nav = [
    ["网站首页", "Home", "/#home"],
    ["关于我们", "ABOUT US", "/#about"],
    ["产品中心", "PRODUCT", "/#product"],
    ["案例展示", "CASE", "/#case"],
    ["设计团队", "TEAMS", "/#teams"],
    ["新闻动态", "NEWS", "/#news"],
    ["联系我们", "CONTACT", "/#contact"]
  ];
  return (
    <>
      <header className="site-header">
        <Link className="brand" to="/">
          <span>家居设计工作室</span>
        </Link>
        <button className="icon-button mobile-only" onClick={() => setOpen(!open)} aria-label="打开导航"><Menu size={20} /></button>
        <nav className={open ? "nav open" : "nav"}>
          {nav.map(([zh, en, href]) => (
            <a key={zh} href={href} onClick={() => setOpen(false)}>
              <strong>{zh}</strong>
              <small>{en}</small>
            </a>
          ))}
          <NavLink to="/admin" onClick={() => setOpen(false)}>后台</NavLink>
        </nav>
      </header>
      <main>{children}</main>
      {showSimpleFooter && <footer className="footer">
        <div>
          <strong>深圳市力天创意工程有限公司</strong>
          <p>专注室内设计、全屋定制、住宅与商业空间设计。</p>
        </div>
        <div>
          <span>+852 97904940</span>
          <span>深圳市福田区卓越世纪中心 4 号楼 501B</span>
        </div>
      </footer>}
    </>
  );
}

function HomePage() {
  const { site, loading } = useSite();
  const [slide, setSlide] = useState(0);
  const [cat, setCat] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setSlide((value) => (value + 1) % BANNERS.length), 5000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    const items = document.querySelectorAll(".reveal-product-grid");
    if (!("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);
  if (loading) return <Loading />;
  const about = site.pages.find((p) => p.slug === "about");
  const services = site.pages.filter((p) => ["residential-design", "commercial-design", "custom-furniture", "process"].includes(p.slug));
  const productCategories = ["产品分类一", "产品分类二", "产品分类三", "产品分类四", "产品分类五"];
  const news = [
    site.notices[0] || { title: NEWS_ITEMS[0][0], body: NEWS_ITEMS[0][1], updated_at: "2018-08-21" },
    site.notices[1] || { title: NEWS_ITEMS[1][0], body: NEWS_ITEMS[1][1], updated_at: "2018-08-21" },
    site.notices[2] || { title: NEWS_ITEMS[2][0], body: NEWS_ITEMS[2][1], updated_at: "2018-08-21" }
  ];
  return (
    <Shell showSimpleFooter={false}>
      <section id="home" className="template-hero">
        {BANNERS.map((image, index) => (
          <div
            className={index === slide ? "template-hero-slide active" : "template-hero-slide"}
            key={image}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
        <button className="hero-arrow left" onClick={() => setSlide((slide - 1 + BANNERS.length) % BANNERS.length)} aria-label="上一张">‹</button>
        <button className="hero-arrow right" onClick={() => setSlide((slide + 1) % BANNERS.length)} aria-label="下一张">›</button>
        <div className="hero-dots">
          {BANNERS.map((_, index) => <button className={index === slide ? "active" : ""} key={index} onClick={() => setSlide(index)} aria-label={`切换到第 ${index + 1} 张`} />)}
        </div>
      </section>
      <section id="product" className="template-section product-section">
        <SectionTitle zh="产品中心" en="PRODUCT" />
        <div className="category-tabs">
          {productCategories.map((name, index) => (
            <button className={cat === index ? "active" : ""} key={name} onClick={() => setCat(index)}>{name}</button>
          ))}
        </div>
        <div className="product-grid reveal-product-grid">
          {PRODUCT_ITEMS.map((name, index) => (
            <Link className="product-card" to={`/pages/${services[index % services.length]?.slug || "residential-design"}`} key={name}>
              <img src={PRODUCT_IMAGES[index]} alt={name} loading="lazy" />
              <span className="product-shade" />
              <i aria-hidden="true" />
              <p>{name}</p>
            </Link>
          ))}
        </div>
      </section>
      <section id="about" className="about-template">
        <div className="about-image-panel">
          <img src={ABOUT_IMAGES[1]} alt="公司简介" loading="lazy" />
          <div className="about-switch">
            <button aria-label="上一张">‹</button>
            <button aria-label="下一张">›</button>
          </div>
        </div>
        <div className="about-copy">
          <h2>家居设计工作室网站模板</h2>
          <p>{about?.summary || "核心价值观：诚信、创新、服务。企业精神：团结拼搏、开拓求实、满足用户、科技进步。"}</p>
          {(about?.sections || []).slice(0, 2).map((section) => <p key={section.heading}>{section.body}</p>)}
          <p>我们坚持用专业化服务与扎实执行，为客户提供高质量空间设计方案，并把每一次合作建立在客户满意的基础上。</p>
          <Link className="outline-more" to="/pages/about">+MORE+</Link>
        </div>
      </section>
      <section id="teams" className="team-template" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,.72), rgba(0,0,0,.72)), url(${BANNERS[0]})` }}>
        <SectionTitle zh="设计团队" en="TEAMS" dark />
        <div className="team-stage">
          <button className="team-arrow left" aria-label="上一组">‹</button>
          <div className="team-grid">
            {TEAM_ITEMS.map(([name, desc], index) => (
              <article className="team-card" key={name}>
                <img src={TEAM_IMAGES[index]} alt={name} loading="lazy" />
                <div>
                  <h3>{name}</h3>
                  <p>{desc}</p>
                </div>
              </article>
            ))}
          </div>
          <button className="team-arrow right" aria-label="下一组">›</button>
        </div>
      </section>
      <section id="case" className="case-template">
        <SectionTitle zh="案例展示" en="CASE" />
        <div className="showcase-row">
          {CASE_ITEMS.map((name, index) => (
            <article className="showcase-card" key={name}>
              <img src={site.cases[index]?.cover || CASE_IMAGES[index]} alt={site.cases[index]?.title || name} loading="lazy" />
              <div><h3>{site.cases[index]?.title || name}</h3></div>
            </article>
          ))}
        </div>
      </section>
      <section id="news" className="news-template">
        <SectionTitle zh="新闻动态" en="NEWS" />
        <div className="news-grid">
          {news.map((item, index) => (
            <article className="news-card" key={item.title}>
              <img src={NEWS_IMAGES[index]} alt={item.title} loading="lazy" />
              <div>
                <h3>{item.title}</h3>
                <time>{item.updated_at?.slice(0, 10) || "2018-08-21"}</time>
                <p>{item.body}</p>
                <Link to="/pages/about" aria-label="查看新闻">→</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section id="contact" className="template-footer" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,.82), rgba(0,0,0,.82)), url(${FOOTER_BG})` }}>
        <div className="footer-inner">
          <div className="footer-main">
            <nav>
              <a href="#home">网站首页</a>
              <a href="#about">关于我们</a>
              <a href="#product">产品中心</a>
              <a href="#case">案例展示</a>
              <a href="#teams">设计团队</a>
              <a href="#news">新闻动态</a>
              <a href="#contact">联系我们</a>
              <Link to="/admin">后台管理</Link>
            </nav>
            <div className="footer-contact">
              <p>联系地址：深圳市福田区卓越世纪中心 4 号楼 501B</p>
              <p>联系电话：+852 97904940</p>
              <p>E-mail：admin@qq.com</p>
              <p>服务热线：13800000000</p>
            </div>
          </div>
          <div className="qr-card">
            <img src={QR_IMAGE} alt="关注我们" />
            <p>扫一扫，关注我们</p>
          </div>
        </div>
        <div className="copyright">Copyright © 2012-{new Date().getFullYear()} 力天空间设计 版权所有</div>
      </section>
    </Shell>
  );
}

function SectionTitle({ zh, en, dark = false }) {
  return (
    <div className={dark ? "template-title dark" : "template-title"}>
      <div>
        <span />
        <h2>{zh}</h2>
        <span />
      </div>
      <p>{en}</p>
    </div>
  );
}

function PageView() {
  const { slug } = useParams();
  const { site, loading } = useSite();
  if (loading) return <Loading />;
  const page = site.pages.find((p) => p.slug === slug);
  if (!page) return <Shell><section className="section"><h1>页面不存在</h1></section></Shell>;
  const showCases = ["residential-cases", "commercial-cases"].includes(page.slug);
  return (
    <Shell>
      <PageHero page={page} />
      <section className="content-section">
        {page.sections.map((section, index) => (
          <article className="content-block" key={`${section.heading}-${index}`}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h2>{section.heading}</h2>
            <p>{section.body}</p>
          </article>
        ))}
      </section>
      {showCases && <section className="section"><CaseGrid cases={site.cases.filter((c) => page.slug === "residential-cases" ? c.type === "住宅" : c.type === "商业")} /></section>}
      {page.slug === "appointment" && <AppointmentForm />}
      {page.slug === "employee-login" && <LoginPanel role="employee" title="员工登录" />}
      {page.slug === "customer-auth" && <CustomerCenter />}
    </Shell>
  );
}

function PageHero({ page }) {
  return (
    <section className="page-hero">
      <p className="eyebrow">{page.category}</p>
      <h1>{page.title}</h1>
      <p>{page.subtitle}</p>
      <span>{page.summary}</span>
    </section>
  );
}

function CaseGrid({ cases }) {
  return (
    <div className="case-grid">
      {cases.map((item) => (
        <article className="case-card" key={item.id}>
          <img src={item.cover} alt={item.title} />
          <div>
            <span>{item.type} / {item.style} / {item.area}</span>
            <h3>{item.title}</h3>
            <p>{item.summary}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

function AppointmentForm() {
  const [form, setForm] = useState({ name: "", phone: "", appointment_time: "", service_type: "住宅", message: "" });
  const [message, setMessage] = useState("");
  async function submit(e) {
    e.preventDefault();
    await api.appointment(form);
    setMessage("预约已提交，设计顾问将在 1 个工作日内联系您。");
    setForm({ name: "", phone: "", appointment_time: "", service_type: "住宅", message: "" });
  }
  return (
    <section className="form-section">
      <form className="form-panel" onSubmit={submit}>
        <Field label="姓名" value={form.name} onChange={(name) => setForm({ ...form, name })} />
        <Field label="电话" value={form.phone} onChange={(phone) => setForm({ ...form, phone })} />
        <Field label="预约时间" type="datetime-local" value={form.appointment_time} onChange={(appointment_time) => setForm({ ...form, appointment_time })} />
        <label>服务类型<select value={form.service_type} onChange={(e) => setForm({ ...form, service_type: e.target.value })}><option>住宅</option><option>商业</option></select></label>
        <label>需求描述<textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></label>
        <button className="primary" type="submit">提交预约 <Phone size={18} /></button>
        {message && <p className="success">{message}</p>}
      </form>
    </section>
  );
}

function CustomerCenter() {
  return (
    <section className="auth-grid">
      <LoginPanel role="customer" title="客户登录" />
      <RegisterPanel />
    </section>
  );
}

function LoginPanel({ role = "admin", title = "后台登录", onSuccess }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  async function submit(e) {
    e.preventDefault();
    try {
      const data = await api.login({ ...form, role });
      localStorage.setItem("litian_token", data.token);
      localStorage.setItem("litian_user", JSON.stringify(data.user));
      setMessage("登录成功");
      onSuccess?.();
    } catch (err) {
      setMessage(err.message);
    }
  }
  return (
    <form className="form-panel compact" onSubmit={submit}>
      <h2>{title}</h2>
      <Field label="账号/手机号" value={form.username} onChange={(username) => setForm({ ...form, username })} />
      <Field label="密码" type="password" value={form.password} onChange={(password) => setForm({ ...form, password })} />
      <button className="primary" type="submit"><LogIn size={18} /> 登录</button>
      {message && <p className="success">{message}</p>}
    </form>
  );
}

function RegisterPanel() {
  const [form, setForm] = useState({ name: "", phone: "", password: "" });
  const [message, setMessage] = useState("");
  async function submit(e) {
    e.preventDefault();
    try {
      await api.register(form);
      setMessage("注册成功，请使用手机号登录。");
    } catch (err) {
      setMessage(err.message);
    }
  }
  return (
    <form className="form-panel compact" onSubmit={submit}>
      <h2>客户注册</h2>
      <Field label="姓名" value={form.name} onChange={(name) => setForm({ ...form, name })} />
      <Field label="手机号" value={form.phone} onChange={(phone) => setForm({ ...form, phone })} />
      <Field label="设置密码" type="password" value={form.password} onChange={(password) => setForm({ ...form, password })} />
      <button className="primary" type="submit"><UserPlus size={18} /> 注册</button>
      {message && <p className="success">{message}</p>}
    </form>
  );
}

function AdminPage() {
  const [logged, setLogged] = useState(Boolean(localStorage.getItem("litian_token")));
  if (!logged) return <Shell><section className="admin-login"><LoginPanel title="后台登录" role="admin" onSuccess={() => setLogged(true)} /></section></Shell>;
  return <Shell><AdminDashboard /></Shell>;
}

function AdminDashboard() {
  const [tab, setTab] = useState("pages");
  const tabs = [
    ["pages", "页面内容", Edit3],
    ["cases", "案例管理", Building2],
    ["appointments", "预约", ClipboardList],
    ["customers", "客户", Users],
    ["employees", "员工", ShieldCheck],
    ["sales_leads", "销售", LayoutDashboard]
  ];
  return (
    <section className="admin-shell">
      <aside>
        <h1>后台管理</h1>
        {tabs.map(([id, label, TabIcon]) => (
          <button className={tab === id ? "active" : ""} key={id} onClick={() => setTab(id)}>{React.createElement(TabIcon, { size: 18 })} {label}</button>
        ))}
      </aside>
      <div className="admin-panel">
        {tab === "pages" && <PageEditor />}
        {tab === "cases" && <CaseEditor />}
        {["appointments", "customers", "employees", "sales_leads"].includes(tab) && <TableManager table={tab} />}
      </div>
    </section>
  );
}

function PageEditor() {
  const [pages, setPages] = useState([]);
  const [selected, setSelected] = useState(null);
  const load = () => api.adminPages().then((items) => { setPages(items); setSelected(items[0]); });
  useEffect(load, []);
  async function save() {
    await api.updatePage(selected.slug, selected);
    await load();
  }
  return (
    <div>
      <h2>页面内容编辑</h2>
      <div className="editor-grid">
        <select value={selected?.slug || ""} onChange={(e) => setSelected(pages.find((p) => p.slug === e.target.value))}>
          {pages.map((p) => <option key={p.slug} value={p.slug}>{p.sort_order}. {p.title}</option>)}
        </select>
        {selected && (
          <div className="editor-form">
            <Field label="标题" value={selected.title} onChange={(title) => setSelected({ ...selected, title })} />
            <Field label="副标题" value={selected.subtitle} onChange={(subtitle) => setSelected({ ...selected, subtitle })} />
            <label>摘要<textarea value={selected.summary} onChange={(e) => setSelected({ ...selected, summary: e.target.value })} /></label>
            <Field label="分类" value={selected.category} onChange={(category) => setSelected({ ...selected, category })} />
            <Field label="排序" type="number" value={selected.sort_order} onChange={(sort_order) => setSelected({ ...selected, sort_order: Number(sort_order) })} />
            <label className="check"><input type="checkbox" checked={selected.is_published} onChange={(e) => setSelected({ ...selected, is_published: e.target.checked })} /> 发布</label>
            <h3>内容段落</h3>
            {selected.sections.map((section, index) => (
              <div className="section-edit" key={index}>
                <Field label="段落标题" value={section.heading} onChange={(heading) => setSelected({ ...selected, sections: selected.sections.map((s, i) => i === index ? { ...s, heading } : s) })} />
                <label>段落正文<textarea value={section.body} onChange={(e) => setSelected({ ...selected, sections: selected.sections.map((s, i) => i === index ? { ...s, body: e.target.value } : s) })} /></label>
              </div>
            ))}
            <button className="secondary" onClick={() => setSelected({ ...selected, sections: [...selected.sections, { heading: "新段落", body: "" }] })}>新增段落</button>
            <button className="primary" onClick={save}><Save size={18} /> 保存页面</button>
          </div>
        )}
      </div>
    </div>
  );
}

function CaseEditor() {
  const empty = { title: "", type: "住宅", style: "", area: "", cover: "", summary: "", is_published: true };
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const load = () => api.adminCases().then(setItems);
  useEffect(load, []);
  async function submit(e) {
    e.preventDefault();
    await api.createCase(form);
    setForm(empty);
    load();
  }
  return (
    <div>
      <h2>案例管理</h2>
      <form className="inline-form" onSubmit={submit}>
        {["title", "style", "area", "cover"].map((key) => <Field key={key} label={{ title: "标题", style: "风格", area: "面积", cover: "图片URL" }[key]} value={form[key]} onChange={(value) => setForm({ ...form, [key]: value })} />)}
        <label>类型<select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option>住宅</option><option>商业</option></select></label>
        <label>摘要<textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} /></label>
        <button className="primary" type="submit">新增案例</button>
      </form>
      <DataTable rows={items} />
    </div>
  );
}

function TableManager({ table }) {
  const [rows, setRows] = useState([]);
  const load = () => api.table(table).then(setRows);
  useEffect(load, [table]);
  return (
    <div>
      <h2>{({ appointments: "预约记录", customers: "客户资料", employees: "员工资料", sales_leads: "销售登记" })[table]}</h2>
      <DataTable rows={rows} />
    </div>
  );
}

function DataTable({ rows }) {
  const columns = useMemo(() => rows[0] ? Object.keys(rows[0]) : [], [rows]);
  if (!rows.length) return <p className="empty">暂无数据</p>;
  return (
    <div className="table-wrap">
      <table>
        <thead><tr>{columns.map((c) => <th key={c}>{c}</th>)}</tr></thead>
        <tbody>{rows.map((row) => <tr key={row.id}>{columns.map((c) => <td key={c}>{String(row[c] ?? "")}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }) {
  return <label>{label}<input type={type} value={value} onChange={(e) => onChange(e.target.value)} /></label>;
}

function Loading() {
  return <div className="loading"><Home size={24} /> 正在载入力天空间设计...</div>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pages/:slug" element={<PageView />} />
        <Route path="/customer" element={<Shell><PageHero page={{ category: "登录中心", title: "客户中心", subtitle: "注册登录，尊享专属服务", summary: "查看设计方案、预约服务、查询进度、专属优惠。" }} /><CustomerCenter /></Shell>} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

createRoot(document.getElementById("root")).render(<App />);
