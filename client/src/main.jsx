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
  Sparkles,
  UserPlus,
  Users
} from "lucide-react";
import { api } from "./api";
import "./styles.css";

const heroImage = "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=82";

function useSite() {
  const [site, setSite] = useState({ pages: [], cases: [], notices: [] });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.site().then(setSite).finally(() => setLoading(false));
  }, []);
  return { site, loading };
}

function Shell({ children }) {
  const { site } = useSite();
  const [open, setOpen] = useState(false);
  const nav = site.pages.filter((p) => ["home", "about", "residential-design", "commercial-design", "residential-cases", "appointment", "contact"].includes(p.slug));
  return (
    <>
      <header className="site-header">
        <Link className="brand" to="/">
          <span>力天</span>
          <small>空间设计</small>
        </Link>
        <button className="icon-button mobile-only" onClick={() => setOpen(!open)} aria-label="打开导航"><Menu size={20} /></button>
        <nav className={open ? "nav open" : "nav"}>
          {nav.map((item) => (
            <NavLink key={item.slug} to={item.slug === "home" ? "/" : `/pages/${item.slug}`} onClick={() => setOpen(false)}>
              {item.title.replace("空间设计", "")}
            </NavLink>
          ))}
          <NavLink to="/customer">客户中心</NavLink>
          <NavLink to="/admin">后台</NavLink>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="footer">
        <div>
          <strong>深圳市力天创意工程有限公司</strong>
          <p>专注室内设计、全屋定制、住宅与商业空间设计。</p>
        </div>
        <div>
          <span>+852 97904940</span>
          <span>深圳市福田区卓越世纪中心 4 号楼 501B</span>
        </div>
      </footer>
    </>
  );
}

function HomePage() {
  const { site, loading } = useSite();
  if (loading) return <Loading />;
  const home = site.pages.find((p) => p.slug === "home");
  const services = site.pages.filter((p) => ["residential-design", "commercial-design", "custom-furniture"].includes(p.slug));
  const stats = [
    ["20+", "内容栏目"],
    ["1:1", "落地监管"],
    ["2级", "合作施工资质"],
    ["1日", "预约响应"]
  ];
  return (
    <Shell>
      <section className="hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(19, 31, 32, .76), rgba(19,31,32,.22)), url(${heroImage})` }}>
        <div className="hero-content">
          <p className="eyebrow">室内设计 | 全屋定制 | 住宅商业空间</p>
          <h1>{home?.title} | {home?.subtitle}</h1>
          <p>{home?.summary}</p>
          <div className="actions">
            <Link className="primary" to="/pages/appointment">预约设计咨询 <ArrowRight size={18} /></Link>
            <Link className="secondary" to="/pages/process">查看服务流程</Link>
          </div>
        </div>
      </section>
      <section className="stat-band">
        {stats.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}
      </section>
      <section className="section">
        <div className="section-title">
          <p className="eyebrow">Service</p>
          <h2>设计从灵感开始，也要稳稳落地</h2>
        </div>
        <div className="service-grid">
          {services.map((item) => (
            <Link className="service-card" to={`/pages/${item.slug}`} key={item.slug}>
              <Sparkles size={24} />
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="split-section">
        <div>
          <p className="eyebrow">Cases</p>
          <h2>住宅与商业空间案例</h2>
          <p>后台可维护案例图片、风格、面积与说明。当前已放入适合上线前演示的设计空间素材。</p>
          <Link className="text-link" to="/pages/residential-cases">浏览案例 <ArrowRight size={16} /></Link>
        </div>
        <CaseGrid cases={site.cases.slice(0, 4)} />
      </section>
      <section className="notice-band">
        {site.notices.slice(0, 3).map((notice) => (
          <article key={notice.id}>
            <ClipboardList size={18} />
            <h3>{notice.title}</h3>
            <p>{notice.body}</p>
          </article>
        ))}
      </section>
    </Shell>
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
