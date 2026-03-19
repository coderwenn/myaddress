import React from 'react';
import { Github } from '@icon-park/react';
import img from '@/file/images/图片.jpg'
import request from '@/utils/netWork';

import './index.less';


const Home: React.FC = () => {

    // test login info
    async function testUserInfo() {
        const res = await request.post(
            '/user/getUserList'
        )
        console.log(res)
    }
    return (
        <div className='mesBox'>
            <section className="intro-section">
                <div className="intro-content">
                    <h1>你好，我是温千禧</h1>
                    <p>专业的web全栈开发</p>
                    <button className="contact-btn" onClick={testUserInfo}>查看作品</button>
                </div>
                <div className="profile-image">
                    <img src={img} alt="个人照片" />
                </div>
            </section >

            {/* 专业技能部分 */}
            <section className="skills-section" >
                <h2>专业技能</h2>
                <div className="skills-grid">
                    <div className="skill-card">
                        <div className="skill-icon">UI设计</div>
                        <p>擅长UI设计，包括移动端和Web端界面设计</p>
                    </div>
                    <div className="skill-card">
                        <div className="skill-icon">前端开发</div>
                        <p>精通React、Vue等前端框架和相关技术栈</p>
                    </div>
                    <div className="skill-card">
                        <div className="skill-icon">用户体验</div>
                        <p>注重用户体验，能创造直观易用的交互界面</p>
                    </div>
                </div>
            </section >

            {/* 精选作品部分 */}
            <section className="portfolio-section" >
                <h2>精选作品</h2>
                <div className="portfolio-grid">
                    <div className="portfolio-item">
                        <img src="http://www.zztaitung.com/wp-content/uploads/2016/01/%E9%83%BD%E8%98%AD%E7%81%A3%E8%A1%9D%E6%B5%AA-3-75_%E8%AA%BF%E6%95%B4%E5%A4%A7%E5%B0%8F.jpg" alt="社交媒体设计" />
                        <h3>智能客服设计</h3>
                        <p>基于AI的智能客服系统界面设计</p>
                        <a href="#" className="view-more">了解更多</a>
                    </div>
                    <div className="portfolio-item">
                        <img src="http://www.zztaitung.com/wp-content/uploads/2016/01/%E9%83%BD%E8%98%AD%E7%81%A3%E8%A1%9D%E6%B5%AA-3-75_%E8%AA%BF%E6%95%B4%E5%A4%A7%E5%B0%8F.jpg" alt="社交媒体设计" />
                        <h3>金融应用界面</h3>
                        <p>专业的金融数据可视化界面设计</p>
                        <a href="#" className="view-more">了解更多</a>
                    </div>
                    <div className="portfolio-item">
                        <img src="http://www.zztaitung.com/wp-content/uploads/2016/01/%E9%83%BD%E8%98%AD%E7%81%A3%E8%A1%9D%E6%B5%AA-3-75_%E8%AA%BF%E6%95%B4%E5%A4%A7%E5%B0%8F.jpg" alt="社交媒体设计" />
                        <h3>教育平台设计</h3>
                        <p>在线教育平台的整体界面设计</p>
                        <a href="#" className="view-more">了解更多</a>
                    </div>
                    <div className="portfolio-item">
                        <img src="http://www.zztaitung.com/wp-content/uploads/2016/01/%E9%83%BD%E8%98%AD%E7%81%A3%E8%A1%9D%E6%B5%AA-3-75_%E8%AA%BF%E6%95%B4%E5%A4%A7%E5%B0%8F.jpg" alt="社交媒体设计" />
                        <h3>社交媒体设计</h3>
                        <p>社交媒体应用的UI/UX设计</p>
                        <a href="#" className="view-more">了解更多</a>
                    </div>
                </div>
            </section >

            {/* 关于我部分 */}
            < section className="about-section" >
                <h2>关于我</h2>
                <p>我是一名拥有多年经验的全栈开发者和UI设计师，专注于创造美观且实用的数字产品。我热爱将创意转化为现实，并持续学习新技术来提升自己。</p>
                <div className="specialties">
                    <span>UI设计</span>
                    <span>UX设计</span>
                    <span>前端开发</span>
                    <span>后端开发</span>
                </div>
            </ section>

            {/* 联系方式部分 */}
            <section className="contact-section" >
                <h2>联系方式</h2>
                <div className="social-links">
                    <Github theme="outline" size="24" fill="#333" />
                    <a href="#" className="social-link">LinkedIn</a>
                    <a href="#" className="social-link">Twitter</a>
                    <a href="#" className="social-link">Email</a>
                </div>
                <button className="contact-btn">发送邮件</button>
            </section>
        </div >
    );
};

export default Home;