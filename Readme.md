# 3D Scene Visualization Challenge

A 3D visualization tool that renders a 3D scene using data from a JSON input containing information about points and cuboids.

## Instructions

For detailed instructions, see [Instructions.md](Instructions.md).

## Live Demo

Deployed application: [https://pandasetchallenge.netlify.app/](https://pandasetchallenge.netlify.app/)

## References and Exploration

- Basic React Three Fiber demo: https://codesandbox.io/s/rrppl0y8l4
- Rendering points with Three.js: https://github.com/mrdoob/three.js/blob/master/examples/webgl_interactive_points.html
- Scaling performance with instancing: https://r3f.docs.pmnd.rs/advanced/scaling-performance#instancing
- Instancing example: https://codesandbox.io/s/h873k
- Rendering 1 million boxes in React Three Fiber: https://stackoverflow.com/questions/67196360/rendering-1-million-boxes-in-react-three-fiber
- Switching between cameras: https://codesandbox.io/p/sandbox/switching-between-cameras-2jod7
- Editor references:
  - Three.js Editor: https://threejs.org/editor/
  - Pandaset: https://pandaset.org/
- Note: While creating instances declaratively keeps all the power of components with reduced draw calls, it comes at the cost of CPU overhead. For cases like foliage where you want no CPU overhead with thousands of instances, you should use `THREE.InstancedMesh` as in this example: http://drei.docs.pmnd.rs/performances/instances#instances
- Instanced colors examples:
  - https://codesandbox.io/p/sandbox/r3f-instanced-colors-5o0qu
  - https://codesandbox.io/p/sandbox/r3f-instanced-colors-8fo01
- Drei library storybook: https://drei.pmnd.rs/
- EdgesGeometry with InstancedMesh: https://hofk.de/main/discourse.threejs/2020/EdgesGeometry-InstancedMesh/EdgesGeometry-InstancedMesh.html
- Used Claude AI to create the shader material for the cuboids' edges
