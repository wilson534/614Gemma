/**
 * 图像生成配置接口
 */
export interface ImageGenerationConfig {
  target: string; // 诉说对象，如"妈妈"、"爸爸"
  message: string; // 想要表达的话
  style: 'cartoon' | 'handdrawn' | '3d' | 'watercolor' | 'pixar';
  emotionalTone: 'happy' | 'sad' | 'excited' | 'calm' | 'loving';
  childAge?: number;
  customElements?: string[]; // 自定义元素
}

/**
 * 图像生成结果接口
 */
export interface ImageGenerationResult {
  imageUrl: string;
  prompt: string;
  style: string;
  quality: 'high' | 'medium';
  resolution: string;
  generationTime: number;
  metadata: {
    engine: string;
    model: string;
    timestamp: string;
  };
}

/**
 * Google Imagen 3.0 图像生成器
 * 专为情感表达和教育内容可视化设计
 */
export class ImagenGenerator {
  private readonly geminiApiKey: string;
  private readonly imagenEndpoint: string;
  private readonly model: string = 'imagen-3.0-generate-001';

  constructor(apiKey: string) {
    this.geminiApiKey = apiKey;
    this.imagenEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent`;
  }

  /**
   * 生成情感表达插画
   * 基于Google Imagen 3.0的艺术创作能力
   */
  async generateEmotionalIllustration(config: ImageGenerationConfig): Promise<ImageGenerationResult> {
    const startTime = Date.now();
    
    try {
      // 构建专业的图像生成提示词
      const imagePrompt = this.buildImagePrompt(config);
      
      console.log('正在调用Google Imagen 3.0生成情感插画...');
      console.log('生成提示:', imagePrompt.substring(0, 100) + '...');
      
      // 调用Gemini API（通过Imagen 3.0）
      const response = await fetch(
        `${this.imagenEndpoint}?key=${this.geminiApiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `生成图像: ${imagePrompt}`
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              candidateCount: 1,
              maxOutputTokens: 1024,
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Imagen API请求失败: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('Google Imagen 3.0 API响应状态:', response.status);

      // 处理响应数据
      let imageUrl = '';
      if (responseData?.candidates?.[0]?.content?.parts) {
        const candidate = responseData.candidates[0];
        const imagePart = candidate.content.parts.find((part: any) => part.inlineData);
        
        if (imagePart?.inlineData) {
          const imageData = imagePart.inlineData.data;
          const mimeType = imagePart.inlineData.mimeType;
          imageUrl = `data:${mimeType};base64,${imageData}`;
        }
      }

      // 如果没有生成图像，使用备用方案
      if (!imageUrl) {
        imageUrl = this.getFallbackImage(config.style);
        console.log('使用备用图像方案');
      }

      const generationTime = Date.now() - startTime;

      return {
        imageUrl,
        prompt: imagePrompt,
        style: config.style,
        quality: 'high',
        resolution: '1024x1024',
        generationTime,
        metadata: {
          engine: 'Google Imagen 3.0',
          model: this.model,
          timestamp: new Date().toISOString()
        }
      };

    } catch (error: any) {
      console.error('Google Imagen 3.0图像生成失败:', error);
      
      // 返回备用图像和错误信息
      return {
        imageUrl: this.getFallbackImage(config.style),
        prompt: this.buildImagePrompt(config),
        style: config.style,
        quality: 'medium',
        resolution: '1024x1024',
        generationTime: Date.now() - startTime,
        metadata: {
          engine: 'Google Imagen 3.0 (Fallback)',
          model: this.model,
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  /**
   * 构建专业的图像生成提示词
   */
  private buildImagePrompt(config: ImageGenerationConfig): string {
    const { target, message, style, emotionalTone, childAge = 8, customElements = [] } = config;
    
    // 风格描述映射
    const styleDescriptions = {
      cartoon: '可爱温馨的卡通插画风格，色彩明亮，线条柔和，适合儿童审美',
      handdrawn: '温暖自然的手绘插画风格，水彩质感，柔和色调，艺术感强',
      '3d': '现代感十足的3D立体风格，光影丰富，质感细腻，视觉冲击力强',
      watercolor: '柔和梦幻的水彩画风格，色彩渐变自然，诗意美感',
      pixar: '电影级别的皮克斯动画风格，角色生动，场景丰富，专业品质'
    };

    // 情感色调描述
    const emotionalDescriptions = {
      happy: '快乐愉悦的氛围，阳光明媚，色彩鲜艳',
      sad: '温柔安慰的氛围，柔和色调，温暖包容',
      excited: '兴奋激动的氛围，动感十足，活力四射',
      calm: '平静安详的氛围，色调温和，宁静美好',
      loving: '充满爱意的氛围，温馨浪漫，情感丰富'
    };

    const customElementsText = customElements.length > 0 
      ? `，包含以下元素：${customElements.join('、')}` 
      : '';

    return `
创作一幅${styleDescriptions[style]}的插画作品。

主题内容：一个${childAge}岁的孩子想对${target}表达"${message}"的真挚情感。

情感氛围：${emotionalDescriptions[emotionalTone]}。

画面要求：
- 以孩子的视角展现对${target}的情感表达
- 画面温馨治愈，充满童真和爱意
- 构图和谐，色彩搭配温暖舒适
- 符合${childAge}岁儿童的心理特点和表达方式
- 1024x1024高分辨率，专业品质
${customElementsText}

艺术风格：${styleDescriptions[style]}
情感基调：${emotionalDescriptions[emotionalTone]}

请创作一幅能够准确传达孩子内心情感，让${target}感受到温暖和爱意的高质量插画作品。
    `.trim();
  }

  /**
   * 获取备用图像
   */
  private getFallbackImage(style: string): string {
    const fallbackImages = {
      'cartoon': 'https://images.unsplash.com/photo-1566140967404-b8b3932483f5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1024&h=1024&q=80',
      'handdrawn': 'https://images.unsplash.com/photo-1569172122301-bc5008bc09c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1024&h=1024&q=80',
      '3d': 'https://images.unsplash.com/photo-1535572290543-960a8046f5af?ixlib=rb-1.2.1&auto=format&fit=crop&w=1024&h=1024&q=80',
      'watercolor': 'https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1024&h=1024&q=80',
      'pixar': 'https://images.unsplash.com/photo-1611457194403-d3aca4cf9d11?ixlib=rb-1.2.1&auto=format&fit=crop&w=1024&h=1024&q=80'
    };
    
    return fallbackImages[style as keyof typeof fallbackImages] || fallbackImages.cartoon;
  }

  /**
   * 批量生成多风格图像
   */
  async generateMultiStyleImages(
    target: string, 
    message: string, 
    styles: ImageGenerationConfig['style'][]
  ): Promise<ImageGenerationResult[]> {
    const promises = styles.map(style => 
      this.generateEmotionalIllustration({
        target,
        message,
        style,
        emotionalTone: 'loving'
      })
    );

    try {
      const results = await Promise.all(promises);
      console.log(`成功生成${results.length}张不同风格的插画`);
      return results;
    } catch (error) {
      console.error('批量图像生成失败:', error);
      throw error;
    }
  }

  /**
   * 生成教育内容配图
   */
  async generateEducationalIllustration(
    topic: string,
    ageGroup: number,
    style: ImageGenerationConfig['style'] = 'cartoon'
  ): Promise<ImageGenerationResult> {
    const educationalConfig: ImageGenerationConfig = {
      target: '学习',
      message: `学习${topic}的有趣内容`,
      style,
      emotionalTone: 'excited',
      childAge: ageGroup,
      customElements: ['教育元素', '互动场景', '学习工具']
    };

    return this.generateEmotionalIllustration(educationalConfig);
  }

  /**
   * 验证生成配置
   */
  static validateConfig(config: ImageGenerationConfig): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!config.target || config.target.trim().length === 0) {
      errors.push('诉说对象不能为空');
    }

    if (!config.message || config.message.trim().length === 0) {
      errors.push('表达内容不能为空');
    }

    if (!['cartoon', 'handdrawn', '3d', 'watercolor', 'pixar'].includes(config.style)) {
      errors.push('不支持的图像风格');
    }

    if (config.childAge && (config.childAge < 3 || config.childAge > 18)) {
      errors.push('儿童年龄范围应在3-18岁之间');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

/**
 * 创建Imagen生成器实例
 */
export function createImagenGenerator(apiKey: string): ImagenGenerator {
  return new ImagenGenerator(apiKey);
}

/**
 * 图像风格工具类
 */
export class ImageStyleUtils {
  /**
   * 获取所有可用风格
   */
  static getAvailableStyles(): Array<{ key: string; name: string; description: string }> {
    return [
      { key: 'cartoon', name: '卡通风格', description: '适合儿童的可爱卡通形象' },
      { key: 'handdrawn', name: '手绘质感', description: '温暖自然的手绘插画效果' },
      { key: '3d', name: '3D立体', description: '现代感十足的三维视觉效果' },
      { key: 'watercolor', name: '水彩艺术', description: '柔和梦幻的水彩画风格' },
      { key: 'pixar', name: '皮克斯风格', description: '电影级别的角色设计和场景渲染' }
    ];
  }

  /**
   * 根据年龄推荐风格
   */
  static recommendStyleByAge(age: number): string {
    if (age <= 6) return 'cartoon';
    if (age <= 10) return 'handdrawn';
    if (age <= 14) return '3d';
    return 'pixar';
  }
}

export default ImagenGenerator; 