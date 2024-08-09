import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [device1, setDevice1] = useState({ name: '', diagonal: '', aspectRatio: '', layouts: [] });
  const [device2, setDevice2] = useState({ name: '', diagonal: '', aspectRatio: '', layouts: [] });
  const [screenSize1, setScreenSize1] = useState({ longSide: 0, shortSide: 0 });
  const [screenSize2, setScreenSize2] = useState({ longSide: 0, shortSide: 0 });
  const [scaleFactor, setScaleFactor] = useState(1);

  const parseAspectRatio = (ratio) => {
    const [ratioLong, ratioShort] = ratio.split(':').map(Number);
    return { ratioLong, ratioShort };
  };

  const calculateSides = (diagonal, ratioLong, ratioShort) => {
    const shortSide = Math.sqrt((diagonal ** 2) / ((ratioLong / ratioShort) ** 2 + 1));
    const longSide = (ratioLong / ratioShort) * shortSide;
    return { longSide, shortSide };
  };

  const maxAreaAspectRatio = (longSide, shortSide, ratioLong, ratioShort) => {
    if (longSide / shortSide >= ratioLong / ratioShort) {
      const height = shortSide;
      const width = (ratioLong / ratioShort) * height;
      return { width, height, area: width * height };
    } else {
      const width = longSide;
      const height = (ratioShort / ratioLong) * width;
      return { width, height, area: width * height };
    }
  };

  useEffect(() => {
    const updateScaleFactor = () => {
      const containerWidth = window.innerWidth * 0.4; // 40% of the window width for each device
      const maxLongSide = Math.max(screenSize1.longSide, screenSize2.longSide);
      if (maxLongSide > 0) {
        setScaleFactor(containerWidth / maxLongSide);
      }
    };

    window.addEventListener('resize', updateScaleFactor);
    updateScaleFactor();

    return () => window.removeEventListener('resize', updateScaleFactor);
  }, [screenSize1, screenSize2]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const calculateDeviceLayouts = (device, setScreenSize) => {
      const { diagonal, aspectRatio } = device;
      const { ratioLong, ratioShort } = parseAspectRatio(aspectRatio);
      const { longSide, shortSide } = calculateSides(Number(diagonal), ratioLong, ratioShort);
      setScreenSize({ longSide, shortSide });

      const layoutRatios = [
        {
          label: '4:3',
          ratio: { long: 4, short: 3 },
          imageUrl: 'https://i0.wp.com/digital-photography-school.com/wp-content/uploads/2020/03/RatioImage_43.jpg.jpg?w=800&ssl=1',
        },
        {
          label: '35mm Film',
          ratio: { long: 3, short: 2 },
          imageUrl: 'https://cdn.prod.website-files.com/5f58a077d654db1a689fd95b/641a6f142c6abe93e4badf38_Kav%20Dadfar-3x2.jpg',
        },
        {
          label: '16:9',
          ratio: { long: 16, short: 9 },
          imageUrl: 'https://www.denofgeek.com/wp-content/uploads/2022/04/Better-Call-Saul-Season-6-Premiere.jpg?resize=768%2C432',
        },
        {
          label: 'Cinemascope',
          ratio: { long: 2.39, short: 1 },
          imageUrl: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiYm9PiM8edKeuECt8VQ2TVzNjZ2U-iPaIZmFY76xQSCbIGO8TkEEuYKY1SZpfOkYKrR4CQ__OTCRmnPLHdOnfNYIliAQC-yEYNl75VG8HYL190LT6HvI_xJMmRhvvZLzkHVRlmiVMvv1I-/s1600/Screen+Shot+2019-11-24+at+1.40.59+AM.jpeg',
        },
        {
          label: 'A4',
          ratio: { long: 21, short: 29.7 },
          imageUrl: 'https://via.placeholder.com/744x1052.png?text=A4+Paper',
        },
      ];

      const calculatedLayouts = layoutRatios.map((layout) => {
        const { width, height, area } = maxAreaAspectRatio(longSide, shortSide, layout.ratio.long, layout.ratio.short);
        return { ...layout, width, height, area };
      });

      return calculatedLayouts;
    };

    const layouts1 = calculateDeviceLayouts(device1, setScreenSize1);
    const layouts2 = calculateDeviceLayouts(device2, setScreenSize2);

    setDevice1((prev) => ({ ...prev, layouts: layouts1 }));
    setDevice2((prev) => ({ ...prev, layouts: layouts2 }));
  };

  return (
    <div className="App">
      <h1>Screen Layout Calculator</h1>
      <form onSubmit={handleSubmit} className="device-form">
        <div className="device-inputs">
          <h2>Device 1</h2>
          <label>
            Device Name (Optional):
            <input
              type="text"
              value={device1.name}
              onChange={(e) => setDevice1({ ...device1, name: e.target.value })}
            />
          </label>
          <label>
            Screen Diagonal (in inches):
            <input
              type="number"
              value={device1.diagonal}
              onChange={(e) => setDevice1({ ...device1, diagonal: e.target.value })}
              required
            />
          </label>
          <label>
            Aspect Ratio (e.g., 16:9):
            <input
              type="text"
              value={device1.aspectRatio}
              onChange={(e) => setDevice1({ ...device1, aspectRatio: e.target.value })}
              required
            />
          </label>
        </div>
        <div className="device-inputs">
          <h2>Device 2</h2>
          <label>
            Device Name (Optional):
            <input
              type="text"
              value={device2.name}
              onChange={(e) => setDevice2({ ...device2, name: e.target.value })}
            />
          </label>
          <label>
            Screen Diagonal (in inches):
            <input
              type="number"
              value={device2.diagonal}
              onChange={(e) => setDevice2({ ...device2, diagonal: e.target.value })}
            />
          </label>
          <label>
            Aspect Ratio (e.g., 16:9):
            <input
              type="text"
              value={device2.aspectRatio}
              onChange={(e) => setDevice2({ ...device2, aspectRatio: e.target.value })}
            />
          </label>
        </div>
        <button type="submit" className="submit-button">Calculate</button>
      </form>

      {device1.name && <h2>{device1.name} Layouts</h2>}
      {!device1.name && <h2>Device 1 Layouts</h2>}
      <div className="layout-grid">
        {device1.layouts.map((layout, index) => (
          <div
            key={index}
            className="layout-box"
            style={{
              width: `${(screenSize1.longSide * scaleFactor) / 2}px`,
              height: `${(screenSize1.shortSide * scaleFactor) / 2}px`,
              position: 'relative',
              backgroundColor: 'black',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              className="layout-image"
              style={{
                width: `${(layout.width * scaleFactor) / 2}px`,
                height: `${(layout.height * scaleFactor) / 2}px`,
                backgroundImage: `url("${layout.imageUrl}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'absolute',
              }}
            />
            <div className="dimensions-overlay">
              <p>Screen: {screenSize1.longSide.toFixed(2)}" x {screenSize1.shortSide.toFixed(2)}"</p>
              <p>{layout.label}: {layout.width.toFixed(2)}" x {layout.height.toFixed(2)}"</p>
              <p>Area: {layout.area.toFixed(2)} sq.in</p>
            </div>
          </div>
        ))}
      </div>

      {device2.name && <h2>{device2.name} Layouts</h2>}
      {!device2.name && <h2>Device 2 Layouts</h2>}
      <div className="layout-grid">
        {device2.layouts.map((layout, index) => (
          <div
            key={index}
            className="layout-box"
            style={{
              width: `${(screenSize2.longSide * scaleFactor) / 2}px`,
              height: `${(screenSize2.shortSide * scaleFactor) / 2}px`,
              position: 'relative',
              backgroundColor: 'black',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              className="layout-image"
              style={{
                width: `${(layout.width * scaleFactor) / 2}px`,
                height: `${(layout.height * scaleFactor) / 2}px`,
                backgroundImage: `url("${layout.imageUrl}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'absolute',
              }}
            />
            <div className="dimensions-overlay">
              <p>Screen: {screenSize2.longSide.toFixed(2)}" x {screenSize2.shortSide.toFixed(2)}"</p>
              <p>{layout.label}: {layout.width.toFixed(2)}" x {layout.height.toFixed(2)}"</p>
              <p>Area: {layout.area.toFixed(2)} sq.in</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
