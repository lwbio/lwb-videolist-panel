import React, {useState} from 'react';
import { PanelProps, PanelData } from '@grafana/data';
import { SimpleOptions, VideoProps } from 'types';
import { css, cx } from '@emotion/css';
import { useStyles2 } from '@grafana/ui';
import { PanelDataErrorView } from '@grafana/runtime';
import { Col, Row, Modal } from 'antd';

interface Props extends PanelProps<SimpleOptions> {}


const getStyles = () => {
  return {
    wrapper: css`
      font-family: Open Sans;
      position: relative;
      overflow: auto;
      max-height: 100%;
      overflow-x: hidden;
      padding-right: 10px;
    `,
    svg: css`
      position: absolute;
      top: 0;
      left: 0;
    `,
    textBox: css`
      position: absolute;
      bottom: 0;
      left: 0;
      padding: 10px;
    `,
  };
};

function extractVideos(data: PanelData, prefix: string): VideoProps[] {
  const videoInfo: VideoProps[] = [];
  const series = data.series ?? [];

  for (const serie of series) {
    const fields = serie.fields ?? [];
    const valuesMap: Record<string, any[]> = {};

    // 将所有字段值存入 valuesMap
    for (const field of fields) {
      if (field.name && Array.isArray(field.values)) {
        valuesMap[field.name] = field.values;
      }
    }

    // 确保必要字段都存在
    const requiredFields = ["id", "title", "thumbnail", "url", "description"];
    const hasAllFields = requiredFields.every((field) => valuesMap[field]);

    if (hasAllFields) {
      const length = valuesMap["id"].length;
      for (let i = 0; i < length; i++) {
        videoInfo.push({
          id: valuesMap["id"][i],
          title: valuesMap["title"][i],
          thumbnail: prefix + valuesMap["thumbnail"][i],
          url: prefix + valuesMap["url"][i],
          description: valuesMap["description"][i],
        });
      }
    }
  }

  return videoInfo;
}

export const SimplePanel: React.FC<Props> = ({ options, data, width, height, fieldConfig, id }) => {
  const styles = useStyles2(getStyles);
  const [currentVideo, setCurrentVideo] = useState<VideoProps | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const videos = extractVideos(data, options.staticPrefix);
  if (videos.length === 0) {
    return <PanelDataErrorView fieldConfig={fieldConfig} panelId={id} data={data} needsStringField />;
  }

  const handleVideoChange = (video: VideoProps) => {
    setCurrentVideo(video);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentVideo(null); // 关闭弹窗时清空当前视频
  };

  return (
    <div className={cx(styles.wrapper)}>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        {videos.map((video) => (
          <Col key={video.id} className="gutter-row" span={4}>
            <div key={video.id} onClick={() => handleVideoChange(video)}>
                <img src={video.thumbnail} alt={video.title} width="100%" height="100%" />
                <p>{video.title}</p>
              </div>
          </Col>
        ))}
      </Row>
        
      <Modal 
        title={currentVideo?.title} 
        open={isModalOpen} 
        footer={null} 
        onCancel={closeModal}
        destroyOnClose
      >
        {currentVideo && (
          <div>
            <video width="100%" height="100%" controls>
              <source src={currentVideo.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <p>{currentVideo.description}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SimplePanel;
