
          let targetContainer = event.target.closest('#left-side') || event.target.closest('#text-container');
          if (targetContainer) {
              const containerRect = targetContainer.getBoundingClientRect();
              const containerTop = containerRect.top;

              const target = flink.closest('.frame') || flink.closest('.page');
              const targetRect = target.getBoundingClientRect();
              const targetTop = targetRect.top;

              let scrollPosition;

              if (targetContainer.id === 'text-container') {
                  console.log(targetContainer);
                  console.log(containerTop)

                  const frameOffsetTop = target.offsetTop - containerTop + targetContainer.scrollTop;
                  scrollPosition = frameOffsetTop - containerTop;
                  targetContainer.scrollTo({
                      top: scrollPosition,
                      behavior: 'smooth'
                  });
                  // Find the closest frame within #left-side and scroll to it
                  const leftSide = document.getElementById('left-side');
                  const leftSideFrames = leftSide.querySelectorAll('.frame')
                  let closestFrame;
                  let minDistance = Infinity;
                  leftSideFrames.forEach(frame => {
                   if (!frame.classList.contains('hidden')) {
                       const distance = Math.abs(frame.offsetTop - leftSide.scrollTop);
                       if (distance < minDistance) {
                    minDistance = distance;
                    closestFrame = frame;

                    if (closestFrame) {
                      leftSide.scrollTo({
                      top: closestFrame.offsetTop,
                      behavior: 'smooth'
                    });
                  }
                }
                }
              })
              } else {
                  // If the target container is not a page, scroll only the target container
                  scrollPosition = targetTop - containerTop + targetContainer.scrollTop - 20;
                  targetContainer.scrollTo({
                      top: scrollPosition,
                      behavior: 'smooth'
                  });
              }
          }
