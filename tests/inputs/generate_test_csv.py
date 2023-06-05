# Generate some test inputs.

from touch_sonify.paths import get_project_root_dir
import numpy as np
import pandas as pd
from numpy.typing import NDArray
from typing import List


def main() -> None:
    # Demo: two clusters
    def generate_3d_gaussian_points(means: List[float], stds: List[float], n: int) -> NDArray:
        arr = np.zeros([n, 3])
        for i in range(3):
            values = np.random.normal(means[i], stds[i], n)
            arr[:, i] = values
        return arr

    data_1 = generate_3d_gaussian_points(
        means=[-1, -1, -10],
        stds=[0.5, 0.5, 3],
        n=100,
    )

    data_2 = generate_3d_gaussian_points(
        means=[1, 1, 10],
        stds=[0.5, 0.5, 3],
        n=100,
    )

    data = np.concatenate((data_1, data_2), axis=0)

    df = pd.DataFrame(data=data, columns=["x", "y", "z"])
    df.to_csv(get_project_root_dir() / "tests/inputs/twoClustersDemo.csv", index=False)

    # Demo: spiral
    n = 300
    a = np.linspace(0, 1, n)
    r = a * 10
    theta = 2 * np.pi * a * 3
    x = r * np.cos(theta)
    y = r * np.sin(theta)
    z = a * 100

    df = pd.DataFrame(dict(
        x=x,
        y=y,
        z=z,
    ))
    df.to_csv(get_project_root_dir() / "tests/inputs/spiralDemo.csv", index=False)


if __name__ == "__main__":
    main()
