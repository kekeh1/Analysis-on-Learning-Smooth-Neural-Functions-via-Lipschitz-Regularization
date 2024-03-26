#include "random_points_on_mesh.h"
#include <random>
#include <igl/cumsum.h>
#include <igl/doublearea.h>

void random_points_on_mesh(
    const int n,
    const Eigen::MatrixXd& V,
    const Eigen::MatrixXi& F,
    Eigen::MatrixXd& X)
{
    X.resize(n, 3);
    double a1, a2;
    int idx;

    Eigen::Vector3d v1, v2, v3;
    std::random_device dev;
    std::mt19937 rng(dev());
    std::uniform_real_distribution<> dist(0.0, 1.0);

    Eigen::MatrixXd A, C;
    igl::doublearea(V, F, A);


    igl::cumsum(A, 1, C);
    C = C / (C(C.size() - 1));

    for (int i = 0; i < n; i++) {

        a1 = dist(rng);
        a2 = dist(rng);
        if ((a1 + a2) > 1) {
            a1 = 1 - a1;
            a2 = 1 - a2;
        }

        idx = 0;

        for (int j = 0; j < C.rows(); j++) {
            if (C(j) > a2) {
                idx = j;
                break;
            }
        }

        v1 = V.row(F(idx, 0));
        v2 = V.row(F(idx, 1));
        v3 = V.row(F(idx, 2));

        X.row(i) = v1 + a1 * (v2 - v1) + a2 * (v3 - v1);

    }
}

