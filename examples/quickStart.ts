#!/usr/bin/env ts-node

/**
 * 心灵纽带NeuraLink - Google AI核心模块快速开始演示
 * 
 * 本演示展示如何使用Google AI技术栈进行：
 * 1. 儿童健康数据分析 (Gemini 2.5 Pro)
 * 2. 情感插画生成 (Imagen 3.0)
 * 3. 本地智能对话 (Gemma)
 */

import * as dotenv from 'dotenv';
import { GeminiHealthAnalyzer, ChildHealthData } from '../src/services/geminiHealthAnalyzer';
import { ImagenGenerator } from '../src/services/imagenGenerator';
import { GemmaLocalEngine, defaultGemmaConfig } from '../src/services/gemmaLocalEngine';

// 加载环境变量
dotenv.config();

async function main() {
  console.log('🚀 心灵纽带NeuraLink - Google AI技术演示');
  console.log('==========================================\n');

  try {
    // 检查必要的环境变量
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      throw new Error('请在.env文件中配置GEMINI_API_KEY');
    }

    console.log('✅ 环境配置检查通过');
    console.log(`🔑 使用API密钥: ${geminiApiKey.substring(0, 10)}...`);
    console.log('');

    // ==========================================
    // 1. Gemini 2.5 Pro 健康数据分析演示
    // ==========================================
    console.log('📊 [演示1] Gemini 2.5 Pro 健康数据分析');
    console.log('------------------------------------------');
    
    const healthAnalyzer = new GeminiHealthAnalyzer(geminiApiKey);
    
    // 模拟8岁儿童的健康数据
    const healthData: ChildHealthData = {
      meals: {
        breakfast: { 
          description: '牛奶一杯、全麦面包两片、煎蛋一个', 
          hasImage: true 
        },
        lunch: { 
          description: '米饭、青菜炒肉丝、紫菜蛋花汤', 
          hasImage: false 
        },
        dinner: { 
          description: '小米粥、蒸蛋羹、凉拌黄瓜', 
          hasImage: true 
        }
      },
      exercise: {
        type: '户外跑步',
        duration: '30分钟',
        description: '在公园和爸爸一起跑步，还玩了滑梯'
      },
      sleep: {
        startTime: '21:00',
        endTime: '07:00',
        totalHours: 10
      },
      childAge: 8,
      childWeight: 25,
      specialNeeds: []
    };

    console.log('📝 输入健康数据:');
    console.log(`   👶 年龄: ${healthData.childAge}岁`);
    console.log(`   🍽️  饮食: 早餐(${healthData.meals.breakfast.description})`);
    console.log(`   🏃 运动: ${healthData.exercise.type} ${healthData.exercise.duration}`);
    console.log(`   😴 睡眠: ${healthData.sleep.totalHours}小时`);
    console.log('');

    const healthResult = await healthAnalyzer.analyzeChildHealth(healthData);
    
    console.log('🎯 Gemini 2.5 Pro分析结果:');
    console.log(`   📈 综合健康评分: ${healthResult.overallScore}/10`);
    console.log(`   🥗 营养评分: ${healthResult.nutritionAnalysis.score}/10`);
    console.log(`   🏃 运动评分: ${healthResult.exerciseAnalysis.score}/10`);
    console.log(`   😴 睡眠评分: ${healthResult.sleepAnalysis.score}/10`);
    console.log(`   ⏰ 分析时间: ${new Date(healthResult.timestamp).toLocaleString()}`);
    
    if (healthResult.parentGuidance.length > 0) {
      console.log('   💡 家长指导建议:');
      healthResult.parentGuidance.forEach((guidance, index) => {
        console.log(`      ${index + 1}. ${guidance}`);
      });
    }
    console.log('');

    // ==========================================
    // 2. Imagen 3.0 情感插画生成演示
    // ==========================================
    console.log('🎨 [演示2] Imagen 3.0 情感插画生成');
    console.log('------------------------------------------');
    
    const imagenGenerator = new ImagenGenerator(geminiApiKey);
    
    // 基于健康分析结果生成情感插画
    const imageConfig = {
      target: '妈妈',
      message: `我今天健康评分是${healthResult.overallScore}分！我很健康很开心！`,
      style: 'cartoon' as const,
      emotionalTone: 'happy' as const,
      childAge: 8,
      customElements: ['健康', '运动', '营养']
    };

    console.log('📝 输入图像生成配置:');
    console.log(`   🎯 诉说对象: ${imageConfig.target}`);
    console.log(`   💬 表达内容: ${imageConfig.message}`);
    console.log(`   🎨 图像风格: ${imageConfig.style}`);
    console.log(`   😊 情感基调: ${imageConfig.emotionalTone}`);
    console.log('');

    const imageResult = await imagenGenerator.generateEmotionalIllustration(imageConfig);
    
    console.log('🖼️ Imagen 3.0生成结果:');
    console.log(`   📏 分辨率: ${imageResult.resolution}`);
    console.log(`   ⭐ 质量等级: ${imageResult.quality}`);
    console.log(`   ⏱️ 生成时间: ${imageResult.generationTime}ms`);
    console.log(`   🤖 AI引擎: ${imageResult.metadata.engine}`);
    console.log(`   🔗 图像URL: ${imageResult.imageUrl.substring(0, 50)}...`);
    console.log('');

    // ==========================================
    // 3. Gemma本地引擎对话演示
    // ==========================================
    console.log('🏠 [演示3] Gemma本地引擎智能对话');
    console.log('------------------------------------------');
    
    const gemmaEngine = new GemmaLocalEngine(defaultGemmaConfig);
    
    console.log('⚙️ 正在初始化Gemma本地引擎...');
    await gemmaEngine.initialize();
    console.log('✅ Gemma引擎初始化完成');
    console.log('');

    // 模拟儿童对话
    const conversations = [
      {
        userId: 'child_001',
        message: '我今天学了一个新成语叫"拔苗助长"，你能给我讲讲这个故事吗？',
        emotion: 'excited' as const,
        timestamp: Date.now()
      },
      {
        userId: 'child_001', 
        message: '我有点难过，因为今天考试没考好',
        emotion: 'sad' as const,
        timestamp: Date.now() + 1000
      }
    ];

    for (let i = 0; i < conversations.length; i++) {
      const conversation = conversations[i];
      console.log(`💬 对话${i + 1}:`);
      console.log(`   👶 孩子说: "${conversation.message}"`);
      console.log(`   😊 情绪: ${conversation.emotion}`);
      
      if (conversation.message.includes('成语')) {
        // 成语教学演示
        const idiomResponse = await gemmaEngine.teachIdiom('拔苗助长', 8);
        console.log(`   🤖 Gemma回应: 成语教学模式`);
        console.log(`   📚 教学内容: ${idiomResponse.text.substring(0, 100)}...`);
        console.log(`   🎯 置信度: ${idiomResponse.confidence}`);
        console.log(`   ⏱️ 处理时间: ${idiomResponse.processing_time}ms`);
      } else if (conversation.emotion === 'sad') {
        // 情绪安慰演示
        const comfortResponse = await gemmaEngine.provideEmotionalSupport('sad', '考试成绩');
        console.log(`   🤖 Gemma回应: 情绪安慰模式`);
        console.log(`   💝 安慰内容: ${comfortResponse.text.substring(0, 100)}...`);
        console.log(`   🎯 置信度: ${comfortResponse.confidence}`);
        console.log(`   ⏱️ 处理时间: ${comfortResponse.processing_time}ms`);
      } else {
        // 普通对话
        const response = await gemmaEngine.processConversation(conversation);
        console.log(`   🤖 Gemma回应: ${response.text}`);
        console.log(`   🎯 置信度: ${response.confidence}`);
        console.log(`   ⏱️ 处理时间: ${response.processing_time}ms`);
      }
      console.log('');
    }

    // ==========================================
    // 演示总结
    // ==========================================
    console.log('🎉 演示总结');
    console.log('==========================================');
    console.log('✅ Google Gemini 2.5 Pro: 健康数据深度分析完成');
    console.log('✅ Google Imagen 3.0: 情感插画生成完成');
    console.log('✅ Gemma本地引擎: 智能对话交互完成');
    console.log('');
    console.log('🚀 心灵纽带NeuraLink Google AI技术栈演示成功！');
    console.log('');
    console.log('📖 更多功能请参考:');
    console.log('   - 技术文档: docs/TECHNICAL_DETAILS.md');
    console.log('   - API文档: docs/API_REFERENCE.md');
    console.log('   - GitHub: https://github.com/neuralink-ai/neuralink-google-ai-core');

  } catch (error) {
    console.error('❌ 演示过程中发生错误:', error);
    console.log('');
    console.log('🔧 故障排除建议:');
    console.log('1. 检查 .env 文件中的 GEMINI_API_KEY 是否正确');
    console.log('2. 确认网络连接正常');
    console.log('3. 验证Google AI API配额是否充足');
    console.log('4. 查看详细错误信息进行具体排查');
    
    process.exit(1);
  }
}

// 运行演示
if (require.main === module) {
  main().catch(error => {
    console.error('演示启动失败:', error);
    process.exit(1);
  });
}

export default main; 