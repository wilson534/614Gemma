import axios from 'axios';

/**
 * 儿童健康数据接口定义
 */
export interface ChildHealthData {
  meals: {
    breakfast: { description: string; hasImage: boolean };
    lunch: { description: string; hasImage: boolean };
    dinner: { description: string; hasImage: boolean };
  };
  exercise: {
    type: string;
    duration: string;
    description: string;
  };
  sleep: {
    startTime: string;
    endTime: string;
    totalHours: number;
  };
  childAge?: number;
  childWeight?: number;
  specialNeeds?: string[];
}

/**
 * 健康分析结果接口
 */
export interface HealthAnalysisResult {
  overallScore: number; // 1-10分综合健康评分
  nutritionAnalysis: {
    score: number;
    strengths: string[];
    improvements: string[];
    recommendations: string[];
  };
  exerciseAnalysis: {
    score: number;
    adequacy: string;
    suggestions: string[];
  };
  sleepAnalysis: {
    score: number;
    quality: string;
    recommendations: string[];
  };
  parentGuidance: string[];
  emergencyAlerts?: string[];
  nextStepActions: string[];
  timestamp: string;
}

/**
 * Google Gemini 2.5 Pro 健康数据分析器
 * 专为儿童健康管理设计的智能分析引擎
 */
export class GeminiHealthAnalyzer {
  private readonly geminiApiKey: string;
  private readonly geminiEndpoint: string;
  private readonly model: string = 'gemini-2.5-pro';

  constructor(apiKey: string) {
    this.geminiApiKey = apiKey;
    this.geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent`;
  }

  /**
   * 核心健康分析方法
   * 基于Google Gemini 2.5 Pro的深度分析能力
   */
  async analyzeChildHealth(healthData: ChildHealthData): Promise<HealthAnalysisResult> {
    try {
      // 构建专业的健康分析提示词
      const analysisPrompt = this.buildHealthAnalysisPrompt(healthData);
      
      console.log('正在调用Google Gemini 2.5 Pro进行健康数据分析...');
      
      // 调用Gemini API
      const response = await axios.post(
        `${this.geminiEndpoint}?key=${this.geminiApiKey}`,
        {
          contents: [{
            parts: [{ text: analysisPrompt }]
          }],
          generationConfig: {
            temperature: 0.3, // 降低温度确保专业准确的医学建议
            topP: 0.8,
            topK: 40,
            maxOutputTokens: 4096, // 增加输出长度以获得详细分析
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH", 
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );

      // 解析Gemini响应
      const geminiAnalysis = this.extractGeminiResponse(response.data);
      
      // 结构化分析结果
      const structuredResult = await this.structureAnalysisResult(geminiAnalysis, healthData);
      
      console.log('Google Gemini 2.5 Pro健康分析完成');
      return structuredResult;

    } catch (error: any) {
      console.error('Google Gemini健康分析失败:', error);
      throw new Error(`健康分析服务暂时不可用: ${error.message}`);
    }
  }

  /**
   * 构建专业的健康分析提示词
   */
  private buildHealthAnalysisPrompt(healthData: ChildHealthData): string {
    const { meals, exercise, sleep, childAge = 8, childWeight, specialNeeds = [] } = healthData;
    
    return `
作为一位专业的儿童健康顾问和营养师，请对以下儿童健康数据进行深度专业分析：

【儿童基本信息】
年龄：${childAge}岁
体重：${childWeight ? `${childWeight}kg` : '未提供'}
特殊需求：${specialNeeds.length > 0 ? specialNeeds.join(', ') : '无'}

【今日健康数据】
🍽️ 饮食记录：
• 早餐：${meals.breakfast.description || '未记录'}${meals.breakfast.hasImage ? ' (含图片)' : ''}
• 午餐：${meals.lunch.description || '未记录'}${meals.lunch.hasImage ? ' (含图片)' : ''}  
• 晚餐：${meals.dinner.description || '未记录'}${meals.dinner.hasImage ? ' (含图片)' : ''}

🏃‍♂️ 运动情况：
• 运动类型：${exercise.type || '未记录'}
• 运动时长：${exercise.duration || '未记录'}
• 运动描述：${exercise.description || '未记录'}

😴 睡眠状况：
• 入睡时间：${sleep.startTime || '未记录'}
• 起床时间：${sleep.endTime || '未记录'}
• 总睡眠时长：${sleep.totalHours || '未记录'}小时

【专业分析要求】
请从以下维度进行系统分析，并以JSON格式返回结构化结果：

1. 营养评估 (1-10分)：
   - 三大营养素（蛋白质、碳水、脂肪）配比分析
   - 维生素和矿物质摄入评估
   - 食物多样性和营养密度分析
   - 具体改进建议和推荐食物

2. 运动分析 (1-10分)：
   - 运动强度和时长的年龄适宜性
   - 运动类型的科学性评估
   - 体能发展和健康促进效果
   - 运动安全性和改进建议

3. 睡眠质量评估 (1-10分)：
   - 睡眠时长充足性（${childAge}岁儿童建议9-11小时）
   - 作息时间规律性分析
   - 睡眠质量影响因素识别
   - 睡眠环境和习惯优化建议

4. 综合健康评分 (1-10分)：
   - 整体健康状况量化评估
   - 生长发育适宜性分析
   - 潜在健康风险识别
   - 家长重点关注事项

5. 个性化建议：
   - 针对当前年龄段的具体指导
   - 家长实施的具体行动计划
   - 短期（1周）和中期（1月）目标设定
   - 需要专业医生介入的情况预警

请确保建议科学、实用、温暖，符合中国家庭的实际情况和文化背景。`;
  }

  /**
   * 提取Gemini API响应内容
   */
  private extractGeminiResponse(responseData: any): string {
    if (
      responseData?.candidates?.[0]?.content?.parts?.[0]?.text
    ) {
      return responseData.candidates[0].content.parts[0].text;
    }
    throw new Error('Gemini API返回格式异常');
  }

  /**
   * 将Gemini分析结果结构化
   */
  private async structureAnalysisResult(
    geminiAnalysis: string, 
    originalData: ChildHealthData
  ): Promise<HealthAnalysisResult> {
    try {
      // 尝试解析JSON格式的回复
      let parsedAnalysis;
      try {
        // 清理可能的markdown代码块标记
        const cleanedAnalysis = geminiAnalysis
          .replace(/```json/g, '')
          .replace(/```/g, '')
          .trim();
        parsedAnalysis = JSON.parse(cleanedAnalysis);
      } catch {
        // 如果不是JSON格式，使用文本解析
        parsedAnalysis = this.parseTextAnalysis(geminiAnalysis);
      }

      return {
        overallScore: parsedAnalysis.overallScore || 7,
        nutritionAnalysis: {
          score: parsedAnalysis.nutrition?.score || 7,
          strengths: parsedAnalysis.nutrition?.strengths || ['营养搭配基本合理'],
          improvements: parsedAnalysis.nutrition?.improvements || ['增加蔬菜摄入'],
          recommendations: parsedAnalysis.nutrition?.recommendations || ['建议多样化饮食']
        },
        exerciseAnalysis: {
          score: parsedAnalysis.exercise?.score || 7,
          adequacy: parsedAnalysis.exercise?.adequacy || '运动量适中',
          suggestions: parsedAnalysis.exercise?.suggestions || ['保持当前运动习惯']
        },
        sleepAnalysis: {
          score: parsedAnalysis.sleep?.score || 7,
          quality: parsedAnalysis.sleep?.quality || '睡眠质量良好',
          recommendations: parsedAnalysis.sleep?.recommendations || ['保持规律作息']
        },
        parentGuidance: parsedAnalysis.parentGuidance || [
          '继续关注孩子的日常健康状况',
          '鼓励孩子建立健康的生活习惯'
        ],
        emergencyAlerts: parsedAnalysis.emergencyAlerts || [],
        nextStepActions: parsedAnalysis.nextStepActions || [
          '持续记录健康数据',
          '定期评估改进效果'
        ],
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('分析结果结构化失败:', error);
      // 返回默认结构
      return this.getDefaultAnalysisResult();
    }
  }

  /**
   * 文本格式分析结果解析
   */
  private parseTextAnalysis(analysisText: string): any {
    // 简单的文本解析逻辑，提取关键信息
    const scoreRegex = /(\d+(?:\.\d+)?)\s*分/g;
    const scores = [];
    let match;
    while ((match = scoreRegex.exec(analysisText)) !== null) {
      scores.push(parseFloat(match[1]));
    }

    return {
      overallScore: scores[0] || 7,
      nutrition: { score: scores[1] || 7 },
      exercise: { score: scores[2] || 7 },
      sleep: { score: scores[3] || 7 },
      rawAnalysis: analysisText
    };
  }

  /**
   * 获取默认分析结果
   */
  private getDefaultAnalysisResult(): HealthAnalysisResult {
    return {
      overallScore: 7,
      nutritionAnalysis: {
        score: 7,
        strengths: ['基础营养摄入'],
        improvements: ['饮食多样化'],
        recommendations: ['增加蔬果摄入']
      },
      exerciseAnalysis: {
        score: 7,
        adequacy: '需要更多数据评估',
        suggestions: ['保持日常活动']
      },
      sleepAnalysis: {
        score: 7,
        quality: '需要更多数据评估',
        recommendations: ['保持规律作息']
      },
      parentGuidance: ['持续关注孩子健康状况'],
      nextStepActions: ['完善健康数据记录'],
      timestamp: new Date().toISOString()
    };
  }

  /**
   * 生成健康报告摘要
   */
  async generateHealthSummary(analysisResult: HealthAnalysisResult): Promise<string> {
    const { overallScore, nutritionAnalysis, exerciseAnalysis, sleepAnalysis } = analysisResult;
    
    return `
📊 今日健康评分：${overallScore}/10

🍎 营养状况 (${nutritionAnalysis.score}/10)
${nutritionAnalysis.strengths.map(s => `✅ ${s}`).join('\n')}
${nutritionAnalysis.improvements.map(i => `🔄 ${i}`).join('\n')}

🏃 运动状况 (${exerciseAnalysis.score}/10)
${exerciseAnalysis.adequacy}

😴 睡眠状况 (${sleepAnalysis.score}/10)
${sleepAnalysis.quality}

💡 家长指导建议：
${analysisResult.parentGuidance.map(g => `• ${g}`).join('\n')}
    `.trim();
  }
}

/**
 * 创建Gemini健康分析器实例
 */
export function createGeminiHealthAnalyzer(apiKey: string): GeminiHealthAnalyzer {
  return new GeminiHealthAnalyzer(apiKey);
}

/**
 * 健康数据验证工具
 */
export class HealthDataValidator {
  static validateChildHealthData(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!data.meals) {
      errors.push('缺少饮食数据');
    }
    
    if (!data.exercise) {
      errors.push('缺少运动数据');
    }
    
    if (!data.sleep) {
      errors.push('缺少睡眠数据');
    }
    
    if (data.sleep?.totalHours && (data.sleep.totalHours < 0 || data.sleep.totalHours > 24)) {
      errors.push('睡眠时长数据异常');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export default GeminiHealthAnalyzer; 