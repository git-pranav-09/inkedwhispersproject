import Reveal from '@/components/ui/Reveal';

export default function Timeline({ items }) {
  return (
    <ol role="list" className="timeline">
      {items.map((item, i) => (
        <Reveal as="li" key={`${item.marker}-${i}`} className="timeline__item" delay={i * 90}>
          <span className="timeline__node" aria-hidden="true" />
          <p className="timeline__marker">{item.marker}</p>
          <h3 className="timeline__title">{item.title}</h3>
          <p className="timeline__text">{item.text}</p>
        </Reveal>
      ))}
    </ol>
  );
}
